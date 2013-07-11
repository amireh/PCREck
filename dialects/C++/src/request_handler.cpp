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

#include "request_handler.hpp"
#include <algol/utility.hpp>
#include <algol/timer.hpp>
#include <boost/bind.hpp>

namespace rgx {

  enum {
    MODE_CPP,
    MODE_PCRE,
    MODE_LUA
  };

  request_handler::request_handler(identifiable* parent,
    request& req,
    reply& rep,
    lua::engine& engine)
  : identifiable(parent),
    logger("request_handler"),
    req_(req),
    rep_(rep),
    lua_engine_(engine)
  {
  }

  request_handler::~request_handler()
  {
  }

  void request_handler::init()
  {
  }

  bool request_handler::handle()
  {
    algol::timer_t timer;

    // clone the request's content and headers to send them back
    rep_.from_request(req_);

    // scan & process the input
    {
      int mode;

      if (utility::ci_find_substr(req_.uri, "lua") != string_t::npos) {
        mode = MODE_LUA;
      } else if (utility::ci_find_substr(req_.uri, "pcre") != string_t::npos) {
        mode = MODE_PCRE;
      } else {
        mode = MODE_CPP;
      }

      log_->infoStream() << "\tcalling lua engine...";
      // start_timer();
      timer.start();

      if (req_.method == "GET" && req_.uri.find("flags") != string_t::npos) {
        switch(mode) {
          case MODE_LUA:
            lua_engine_.invoke("rgx.Lua.flags", [&](lua_State* lua) -> void {
              rep_.body = string_t(lua_tostring(lua, lua_gettop(lua)));
              lua_remove(lua, lua_gettop(lua));
            }, 1, "std::string", &req_.body);
          break;
          case MODE_PCRE:
            lua_engine_.invoke("rgx.PCRE.flags", [&](lua_State* lua) -> void {
              rep_.body = string_t(lua_tostring(lua, lua_gettop(lua)));
              lua_remove(lua, lua_gettop(lua));
            }, 1, "std::string", &req_.body);
          break;
          case MODE_CPP:
          break;
        }
      }
      else if (req_.method == "POST") {
        switch(mode) {
          case MODE_LUA:
            lua_engine_.invoke("rgx.Lua.test", [&](lua_State* lua) -> void {
              rep_.body = string_t(lua_tostring(lua, lua_gettop(lua)));
              lua_remove(lua, lua_gettop(lua));
            }, 1, "std::string", &req_.body);
          break;
          case MODE_PCRE:
            lua_engine_.invoke("rgx.PCRE.test", [&](lua_State* lua) -> void {
              rep_.body = string_t(lua_tostring(lua, lua_gettop(lua)));
              lua_remove(lua, lua_gettop(lua));
            }, 1, "std::string", &req_.body);
          break;
          case MODE_CPP:
          break;
        }
      }

      // stop_timer();
      timer.stop();
      log_->infoStream() << "\tcalling lua engine took: " << timer.elapsed << "ms";
    }

    // update the CLength header with the new body's size
    rep_.get_header("Content-Length").value = utility::stringify(rep_.body.size());
    rep_.get_header("Content-Type").value = "application/json; charset=utf-8";

    log_->infoStream() << "\tdone!";
    return true;
  }

  void request_handler::on_uuid_set() {
    logger::assign_uuid(get_uuid());
  }

} // end of namespace dakwak
