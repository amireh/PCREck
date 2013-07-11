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

local rgx   = rgx
local json  = require 'dkjson'

if not rgx or not rgx.test_construct then
  return error("rgx.lua: _G['rgx'] or rgx.test_construct implementation is missing!")
end

local flags = {}
local function matcher(pattern, subject, flags)
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

rgx.Lua = {
  test = function(json_construct)
    return rgx.test_construct(json_construct, matcher)
  end,

  flags = function()
    return json.encode(flags)
  end
}
