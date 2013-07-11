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

#ifndef H_rgx_REQUEST_HANDLER_H
#define H_rgx_REQUEST_HANDLER_H

#include <algol/http/request.hpp>
#include <algol/http/reply.hpp>
#include <algol/identifiable.hpp>
#include <algol/logger.hpp>
#include <algol/lua/engine.hpp>

#include <boost/logic/tribool.hpp>

using namespace algol;
using namespace algol::http;

namespace rgx {

  class request_handler : public identifiable, public logger {
    public:

    request_handler(identifiable* parent, request& req, reply& rep, lua::engine&);

    virtual ~request_handler();

    /**
     * Allocates any resources required by this handler.
     *
     * @note
     * this must be called before attempting to handle the request body,
     * ie once the request object is built and the headers parsed
     */
    virtual void init();

    /**
     * this will be called whenever a chunk of data is received (which might
     * be the whole data as well) so it gives the handler the ability
     * to process a request in SAX-style
     *
     * if this is not applicable, handle() will be called when the content
     * has been completely read
     *
     * @return true
     *  The content was sufficient and the request has been handled
     * @return false
     *  The handler has encountered an error and the connection should stop receiving
     * @return boost::indeterminate
     *  More feed is required
     */
    // virtual boost::tribool handle_chunk(string_t);

    /**
     * Called when the request's body has been read entirely and is ready
     * for processing.
     *
     * @return true
     *  The reply has been built successfully
     * @return false
     *  An error occured while processing the request, and it should be rejected
     */
    virtual bool handle();

  protected:
    request         &req_;
    reply           &rep_;
    lua::engine     &lua_engine_;

    /** overridden from algol::identifiable */
    virtual void on_uuid_set();
  };
}

#endif
