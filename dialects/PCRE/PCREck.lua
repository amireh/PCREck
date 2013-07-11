#!/usr/bin/env lua
------------------
--
-- This file is part of PCREck.
--
-- PCREck is free software: you can redistribute it and/or modify
-- it under the terms of the GNU Affero General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- PCREck is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU Affero General Public License for more details.
--
-- You should have received a copy of the GNU Affero General Public License
-- along with PCREck. If not, see <http://www.gnu.org/licenses/>.
--
--
-- PCREck.lua:
-- Uses lrexlib's pcre module to test a PCRE pattern on a subject.
--
-- The script can be invoked with a pattern and a subject to
-- test and the results will be thrown out to STDOUT in either
-- readable, formatted way (default) or a compact one (--compact).
--
-- The script can also be daemonized (-d) to accept newline-delimited
-- JSON array messages that contain the pattern as the first element
-- and the subject as the second one.
--
------------------

local cli = require "cliargs"
local rex_pcre = require 'rex_pcre'
local json = require 'dkjson'

cli:set_name("PCREck")
cli:add_arg("dialect", "the dialect of the regex [Lua|PCRE]")
cli:add_opt("--pattern=PTRN", "the regex pattern")
cli:add_opt("--subject=TEXT", "subject to test using the pattern")
cli:add_opt("--flags=FLAGS",  "regex compilation flags")

local args = cli:parse_args()
if not args then return end

local function test_pcre_construct(pattern, subject, flags)
  print("Testing pattern: [" .. pattern .. "]")
  print("Testing subject: [" .. subject .. "]")

  local success, rex_or_msg = pcall(rex_pcre.new, pattern)
  if not success then
    return nil, "invalid regular expression; " .. rex_or_msg
  end

  -- local match = { rex_pcre:find(subject, rex_or_msg) }
  local match = { rex_or_msg:tfind(subject) }

  -- offset the match starting point (if any) by -1 because Lua indexing starts at 1
  if match[1] then
    match[1] = match[1] - 1
    match[2] = match[2] - 1
  end

  return match
end

local function test_lua_construct(pattern, subject, flags)
  print("Testing pattern: [" .. pattern .. "]")
  print("Testing subject: [" .. subject .. "]")

  local match = { subject:find(pattern) }
  local cstruct = {}

  -- offset the match starting point (if any) by -1 because Lua indexing starts at 1
  if match[1] then
    match = {
      table.remove(match, 1) -1, -- the match begin offset
      table.remove(match, 1) -1, -- the match end offset
      match -- the captures, if any
    }
  end

  return match
end

local RC_MATCH, RC_NOMATCH, RC_BADPATTERN = 'RC_MATCH', 'RC_NOMATCH', 'RC_BADPATTERN'

if not PCREck then
  PCREck = { }
end

local function test_construct(json_construct, type)
  -- we're using a closure so we can conveniently JSON-encode the output
  -- instead of having to do it at every break point
  return json.encode((function()
    local decoded, cstruct = json.decode(json_construct), {}
    if not decoded then
      print("bad JSON data: " .. json_construct .. ", ignoring")
      return {}
    end

    local ptrn  = decoded.pattern
    local str   = decoded.subject

    if not ptrn or not str then
      print("bad pattern or subject: " .. json_construct .. ", ignoring")
      return {}
    end

    local tester = test_pcre_construct

    if type:lower() == 'lua' then
      tester = test_lua_construct
    end

    local encoded, err = tester(ptrn, str)

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

      -- if #cstruct.captures > 0 then
      --   local cursor = 0
      --   local match  = str:sub(cstruct.offset[1], cstruct.offset[2])
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

PCREck.PCRE = {}

function PCREck.PCRE.test(json_construct)
  return test_construct(json_construct, 'pcre')
end

local pcre_flags = {
  ["i"] = "makes matching case insensitive",
  ["m"] = "matching will span across line feeds",
  ["s"] = "makes .* match everything, including control characters",
  ["x"] = "Extended",
  ["U"] = "Ungreedy",
  ["X"] = "Extra",
  ["J"] = "Duplicate names"
}

function PCREck.PCRE.flags()
  return json.encode(pcre_flags)
end

PCREck.Lua = {}
local lua_flags = {}
function PCREck.Lua.test(json_construct)
  return test_construct(json_construct, 'lua')
end

function PCREck.Lua.flags()
  return json.encode(lua_flags)
end

if #args["pattern"] > 0 and #args["subject"] > 0 then
  local request = {
    pattern = args["pattern"],
    subject = args["subject"],
    flags   = args["flags"],

  }
  return print(test_construct(json.encode(request), args["dialect"]))
end