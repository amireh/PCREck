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

#ifndef H_RGX_CONNECTION_H
#define H_RGX_CONNECTION_H

#include <vector>
#include <iostream>
#include <fstream>
#include <sstream>
#include <boost/asio.hpp>
#include <boost/array.hpp>
#include <boost/bind.hpp>
#include <boost/noncopyable.hpp>
#include <boost/shared_ptr.hpp>
#include <boost/enable_shared_from_this.hpp>

#include <algol/logger.hpp>
#include <algol/identifiable.hpp>
#include <algol/timer.hpp>
#include <algol/http/request.hpp>
#include <algol/http/reply.hpp>
#include <algol/lua/engine.hpp>

#include "request_parser.hpp"
#include "request_handler.hpp"

using namespace algol;
using algol::http::request;
using algol::http::reply;

namespace rgx {

  typedef boost::asio::ip::tcp::socket socket_t;
  typedef boost::asio::strand strand_t;
  typedef boost::asio::deadline_timer asio_timer_t;
  typedef boost::array<char, 4096> headbuf_t;
  typedef boost::array<char, 4096> bodybuf_t;

  class connection;
  typedef boost::shared_ptr<connection> connection_ptr;

  /**
   * represents a single connection from a client
   **/
  class connection
    : public identifiable,
      public boost::enable_shared_from_this<connection>,
      public logger,
      protected boost::noncopyable
  {
  public:
    /// Construct a connection with the given io_service.
    explicit connection(boost::asio::io_service& io_service, lua::engine&);
    virtual ~connection();

    /// Get the socket associated with the connection.
    boost::asio::ip::tcp::socket& socket();

    /// Start the first asynchronous operation for the connection.
    virtual void start();

    /// forcefully breaks all async ops and closes the socket
    virtual void stop();

    static void set_timeout(const unsigned int in_seconds);
    static unsigned int get_timeout();

    typedef std::function<void(connection_ptr)> close_handler_t;

    /** The given handler will be called when the connection is done */
    void assign_close_handler(close_handler_t);

  protected:

    virtual void on_uuid_set();

    void read_header();
    void on_header_read( const boost::system::error_code& error, std::size_t bytes_transferred);

    /**
     * reads an arbitrary amount of data from socket into bodybuf_ and processes
     * it in chunks in on_body_read()
     **/
    void read_body();
    void on_body_read(const boost::system::error_code& error, std::size_t bytes_transferred);

    size_t bufsz_; /** the amount of content that has been read */

    void on_request_read();

    void reject(http::reply::status_type);

    void handle_write(const boost::system::error_code& e);

    void begin_timeout(unsigned int in_seconds = timeout_sec_);
    void do_timeout(const boost::system::error_code&);
    void cancel_timeout();

    void send(const reply& r);

    socket_t        socket_;
    strand_t        strand_;
    asio_timer_t    tt_; /** used for timing out the connections */
    headbuf_t       headbuf_;
    bodybuf_t       bodybuf_;
    request_parser  parser_;
    request_handler handler_;
    http::request   inbound_;
    http::reply     outbound_;
    close_handler_t close_handler_;
    algol::timer_t  longevity_timer_; // tracks how long the connection has elapsed
    algol::timer_t  reading_timer_; // how long it took to read the body from the socket

    static unsigned int timeout_sec_;
  };

} // namespace rgx

#endif
