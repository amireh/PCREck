/**
 * This file is part of rgx.
 *
 * rgx is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * rgx is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with rgx. If not, see <http://www.gnu.org/licenses/>.
 */

#include "connection.hpp"
#include "kernel.hpp"
#include <algol/utility.hpp>

using algol::http::request;
using algol::http::reply;

namespace rgx {

  unsigned int connection::timeout_sec_ = 5;

  void connection::set_timeout(const unsigned int in_seconds)
  {
    timeout_sec_ = in_seconds;
  }
  unsigned int connection::get_timeout()
  {
    return timeout_sec_;
  }

  connection::connection(boost::asio::io_service& io_service, lua::engine& lua_engine)
  : identifiable(),
    logger("connection"),
    socket_(io_service),
    strand_(io_service),
    tt_(io_service),
    parser_(inbound_),
    handler_(this, inbound_, outbound_, lua_engine),
    bufsz_(0),
    close_handler_(nullptr)
  {
    outbound_.status = reply::status_type::ok;

    debug() << "created";
  }

  connection::~connection() {
    parser_.cleanup();

    debug() << "destroyed";
  }

  void connection::assign_close_handler(close_handler_t handler) {
    close_handler_ = handler;
  }

  boost::asio::ip::tcp::socket& connection::socket() {
    return socket_;
  }

  void connection::start() {
    socket_.set_option(boost::asio::ip::tcp::no_delay(true));
    boost::asio::socket_base::non_blocking_io command(true);
    socket_.io_control(command);

    read_header();

    longevity_timer_.start();

    // debug() << "listening";
  }

  void connection::stop() {
    cancel_timeout();

    boost::system::error_code ignored_ec;

    // initiate graceful connection closure & stop all asynchronous ops
    try {
      socket_.cancel();
      socket_.shutdown(boost::asio::ip::tcp::socket::shutdown_both, ignored_ec);
      socket_.close(ignored_ec);
    } catch (std::exception& e) {
      error() << "bad socket; couldn't close cleanly";
    }

    longevity_timer_.stop();

    debug() << "closed (elapsed: "
      << longevity_timer_.elapsed << "ms)";

    if (close_handler_) {
      close_handler_(shared_from_this());
    }
  }

  void connection::begin_timeout(unsigned int in_seconds)
  {
    cancel_timeout();

    tt_.expires_from_now(boost::posix_time::seconds(in_seconds));
    tt_.async_wait( boost::bind( &connection::do_timeout, shared_from_this(), _1 ));
  }

  void connection::do_timeout(const boost::system::error_code& ec)
  {
    if (ec)
      return;

    warn() << "client stream has timed out while waiting for content, closing connection";
    return stop();
  }

  void connection::cancel_timeout()
  {
    tt_.cancel();
  }

  void connection::read_header() {
    socket_.async_read_some(boost::asio::buffer(headbuf_),
      strand_.wrap(
        boost::bind(&connection::on_header_read, shared_from_this(),
          boost::asio::placeholders::error,
          boost::asio::placeholders::bytes_transferred)));

    begin_timeout();
  }

  void
  connection::on_header_read(const boost::system::error_code& e, std::size_t bytes_transferred)
  {
    if (e) {
      return stop();
    }

    cancel_timeout();

    boost::tribool result;
    std::string trailer;

    // debug() << "received " << bytes_transferred << " bytes";
    result = parser_.parse_header(headbuf_.data(), headbuf_.data() + bytes_transferred, trailer);

    // parser failed processing the header for some reason
    if (!result)
    {
      debug() << "invalid request header, rejecting";
      return reject(reply::bad_request);
    }

    // header is incomplete, need more feed
    else if (result == boost::indeterminate)
    {
      return read_header();
    }

    // header was successfully parsed, now let's validate it
    if (!inbound_.validate())
    {
      reply::status_type t;

      // track the error
      switch(inbound_.status)
      {
        case request::status_t::invalid_method:
          error() << "request has a non-supported method '" << inbound_ << "', aborting";
          t = reply::not_implemented;
        break;
        case request::status_t::invalid_format:
          error() << "request has a non-supported format '" << inbound_.format_str << "', aborting";
          t = reply::not_implemented;
        break;
        case request::status_t::missing_length:
          info()
          << "request does not specify a Content-Length, can not attempt indeterminate body reading, aborting";
          t = reply::bad_request;
        break;
        case request::status_t::invalid_length:
        error() << "request has 0 Content-Length, aborting";
          t = reply::bad_request;
        break;
        default:
          error() << "unknown request status: " << (int)inbound_.status << ", investigate!";
          t = reply::internal_server_error;
      }

      return reject(t);
    }

    // set up the UUID logging
    // __set_uuid(inbound_.uuid);

    handler_.init();

    // process any trailing bytes that were not part of the HTTP header
    size_t trailing_bytes = trailer.size();
    if (trailing_bytes > 0)
    {
      std::istringstream buf(trailer);
      buf.read(bodybuf_.data(), trailing_bytes);

      debug()
        << "there are " << trailing_bytes << "bytes of trailing data"
        << " and req clength is " << inbound_.content_length << "b";

      inbound_.append_body(bodybuf_.data(), bodybuf_.data() + trailer.size());

      // did the trailer contain the whole request body?
      if (trailer.size() == inbound_.content_length)
        return on_request_read();

      bufsz_ += trailing_bytes;
    }

    reading_timer_.start();

    return read_body();
  }


  void connection::read_body()
  {
    if (inbound_.method == "GET" || inbound_.method == "HEAD") {
      return on_request_read();
    }

    socket_.async_read_some(boost::asio::buffer(bodybuf_),
      strand_.wrap(
        boost::bind(&connection::on_body_read, this,
          boost::asio::placeholders::error,
          boost::asio::placeholders::bytes_transferred)));

    begin_timeout();
  }

  void connection::on_body_read( const boost::system::error_code& error, std::size_t bytes_transferred)
  {
    if (error) {
      return stop();
    }

    cancel_timeout();

    bufsz_ += bytes_transferred;

    inbound_.append_body(bodybuf_.data(), bodybuf_.data() + bytes_transferred);
    // handler_.handle_chunk(string_t(bodybuf_.data()));

    // if we read enough bytes as specified in the Content-Length header, process body
    if (bufsz_ >= inbound_.content_length)
    {
      return on_request_read();
    }

    return read_body();
  }

  void connection::reject(http::reply::status_type rc)
  {
    outbound_ = reply::stock_reply(rc);
    return send(outbound_);
  }

  void connection::on_request_read()
  {
    reading_timer_.stop();

    info() << "body read in " << reading_timer_.elapsed << "ms";

    // trim the request's body
    utility::full_trimi(inbound_.body);

    // handle the request, prepare the reply
    if (!handler_.handle()) {
      info() << "request content was not read successfully, aborting";
      return reject(reply::internal_server_error);
    }

    return send(outbound_);
  }

  void connection::send(const reply& r)
  {
    // send!
    boost::asio::async_write(socket_, r.to_buffers(),
      strand_.wrap(
        boost::bind(&connection::handle_write, shared_from_this(),
          boost::asio::placeholders::error)));
  }

  void connection::handle_write(const boost::system::error_code& e)
  {
    if (!e) {
      string_t status = status_strings::to_string(outbound_.status);
      debug()
        << "reply sent successfully, status => "
        << status.substr(0, status.size()-2); // strip out the trailing \r\n
    } else {
      error() << "reply could not be sent! boost ec: '" << e << "', aborting";
    }

    stop();
  }

  void connection::on_uuid_set() {
    // logger::set_uuid_prefix(this);
  }

} // namespace rgx
