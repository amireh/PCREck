------------------
--
-- This file is part of rgx.
--
-- rgx is free software: you can redistribute it and/or modify
-- it under the terms of the GNU Affero General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- rgx is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU Affero General Public License for more details.
--
-- You should have received a copy of the GNU Affero General Public License
-- along with rgx. If not, see <http://www.gnu.org/licenses/>.
--
------------------
package.cpath = '/usr/local/lib/?.so;' .. package.cpath

local json = require 'dkjson'
local algol = require 'lua_algol'
local logger = algol.logger("Lua")

local rgx;
local ilist;
local split_mcd;

local RC_MATCH, RC_NOMATCH, RC_BADPATTERN = 'RC_MATCH', 'RC_NOMATCH', 'RC_BADPATTERN'

-- Locates the function identified by @name and passes it
-- the arguments. This is used by the C/C++ wrapper.
function arbitrator(name, ...)
  -- construct the method pointer
  local _p = _G
  for word in ilist(split_mcd(name, '.')) do
    _p = _p[word]
    if not _p then
      return error("attempting to call an invalid arbitrary method: " .. name)
    end
  end
  return _p(unpack(arg))
end

-- A multi-char delimiter string splitting routine.
-- Credit goes to Nick Gammon @ http://www.gammon.com.au/forum/?id=6079
split_mcd = function(s, delim)
  assert (type (delim) == "string" and string.len (delim) > 0,
          "bad delimiter")

  local start = 1
  local t = {}  -- results table

  -- find each instance of a string followed by the delimiter
  while true do
    local pos = string.find (s, delim, start, true) -- plain find

    if not pos then
      break
    end

    table.insert (t, string.sub (s, start, pos - 1))
    start = pos + string.len (delim)
  end -- while

  -- insert final one (after last delimiter)
  table.insert (t, string.sub (s, start))

  return t
end -- function split

-- List iterator.
ilist = function(t)
  local i = 0
  local n = table.getn(t)
  return function ()
    i = i + 1
    if i <= n then return t[i] else return nil end
  end
end

if not rgx then
  rgx = {}
end

-- Decodes the JSON construct, validates that the required attributes are
-- set, and passes the pattern, subject, and flags to the specified matcher.
--
-- Returns a JSON-encoded Dialect Construct RC.
function rgx.test_construct(json_construct, matcher)
  assert(type(json_construct) == "string",
    "#test_construct: expected json construct to be a JSON-encoded string")

  assert(type(matcher) == "function",
    "#test_construct: the matcher functor must be assigned")

  -- we're using a closure so we can conveniently JSON-encode the output
  -- instead of having to do it at every break point
  return json.encode((function()
    local decoded, cstruct = json.decode(json_construct), {}
    if not decoded then
      logger:error("bad JSON data: " .. json_construct .. ", ignoring")
      -- TODO: this must propagate to the rhandler and throw a 400 HTTP RC
      return {}
    end

    local ptrn  = decoded.pattern
    local subj  = decoded.subject
    local flags = decoded.flags

    if not ptrn or not subj then
      logger:error("bad pattern or subject: " .. json_construct .. ", ignoring")
      -- TODO: this must propagate to the rhandler and throw a 400 HTTP RC
      return {}
    end

    logger:debug("Pattern: [" .. ptrn .. "]")
    logger:debug("Subject: [" .. subj .. "]")
    logger:debug("Flags: [" .. flags .. "]")

    local encoded, err = matcher(ptrn, subj, flags)

    if not encoded then
      return {
        status = RC_BADPATTERN,
        error  = err
      }
    end

    if #encoded > 0 then
      cstruct = {
        status = RC_MATCH,
        offset = { encoded[1], encoded[2] },
        captures = encoded[3]
      }

      -- try to manually build indices for the capture groups:
      --
      -- >> DISABLED << this is currently impossible unless the implementation
      -- itself provides us with this info
      --
      -- if #cstruct.captures > 0 then
      --   local cursor = 0
      --   local match  = subj:sub(cstruct.offset[1], cstruct.offset[2])
      --   local captures = {}

      --   for capture in ilist(cstruct.captures) do
      --     local c = {
      --       position  = match:find(capture, cursor) - 1,
      --       string    = capture
      --     }

      --     table.insert(captures, c)

      --     cursor = cursor + #capture
      --   end

      --   cstruct.captures = captures
      -- end

      return cstruct
    else
      return {
        status = RC_NOMATCH
      }
    end
  end)())
end

--[[
  local cli = require "cliargs"

  cli:set_name("rgx")
  cli:add_arg("dialect", "the dialect of the regex [Lua|PCRE]")
  cli:add_opt("--pattern=PTRN", "the regex pattern")
  cli:add_opt("--subject=TEXT", "subject to test using the pattern")
  cli:add_opt("--flags=FLAGS",  "regex compilation flags")

  local args = cli:parse_args()
  if not args then return end

  if #args["pattern"] > 0 and #args["subject"] > 0 then
    local request = {
      pattern = args["pattern"],
      subject = args["subject"],
      flags   = args["flags"],

    }
    return print(test_construct(json.encode(request), args["dialect"]))
  end
]]

function rgx_export()
  _G["rgx"] = rgx
end

return rgx