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

#ifndef H_RGX_REQUEST_PARSER_H
#define H_RGX_REQUEST_PARSER_H

#include <boost/logic/tribool.hpp>
#include <boost/tuple/tuple.hpp>
#include <boost/asio.hpp>
#include <iostream>
#include <sstream>

#include <algol/logger.hpp>
#include <algol/http/request.hpp>

using namespace algol;
using namespace algol::http;

namespace rgx {

  /**
   * The request_parser builds an HTTP request object from a socket stream containing
   * the headers and the request body
   */
  class request_parser : public logger {
    public:

    request_parser(request&);
    virtual ~request_parser();

    /**
     * resets the parser to its initial state
     *
     * @warning
     * the parser MUST be reset before attempting a consecutive parse
     **/
    void reset();

    /**
     * parses the header of an HTTP request from the given buffer iterators,
     * and pushes any remaining (unused) bytes into the trailer container,
     * effectively consuming all input given
     *
     * @return true
     *  the header was fully parsed
     * @return false
     *  the header is invalid
     * @return boost::indeterminate
     *  more data is required
     **/
    template <typename InputIterator>
    boost::tribool parse_header( InputIterator begin, InputIterator end, std::string& trailer)
    {
      while (begin != end)
      {
        boost::tribool result = consume(request_, *begin++);

        // header parsed?
        if (result) {

          // move all the remaining bytes into the trailer container
          while (begin != end) {
            trailer.push_back(*begin++);
          }
          return result;
        }
        // parse failed?
        else if (!result) {
          return false;
        }
      }
      boost::tribool result = boost::indeterminate;
      return result;
    }

    /**
     * Cleans up resources used by the parser. The parser will be rendered into
     * an unusable state after this method has been called until reset().
     *
     * @note
     * resetting the parser using request_parser::reset() will call this method
     **/
    void cleanup();

    private:

    /// Handle the next character of input.
    boost::tribool consume(request& req, char input);

    /// Check if a byte is an HTTP character.
    static bool is_char(int c);

    /// Check if a byte is an HTTP control character.
    static bool is_ctl(int c);

    /// Check if a byte is defined as an HTTP tspecial character.
    static bool is_tspecial(int c);

    /// Check if a byte is a digit.
    static bool is_digit(int c);

    /// The current state of the parser.
    enum state
    {
      method_start,
      method,
      uri,
      http_version_h,
      http_version_t_1,
      http_version_t_2,
      http_version_p,
      http_version_slash,
      http_version_major_start,
      http_version_major,
      http_version_minor_start,
      http_version_minor,
      expecting_newline_1,
      header_line_start,
      header_lws,
      header_name,
      space_before_header_value,
      header_value,
      expecting_newline_2,
      expecting_newline_3
    } state_;

    bool parsing_content_length_;

    request&          request_;
  };

}

#endif
