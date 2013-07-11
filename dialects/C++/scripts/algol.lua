-- Locates the function identified by @name and passes it
-- the arguments. This is used by the C/C++ wrapper.
function arbitrator(name, ...)
  -- construct the method pointer
  local _p = _G
  for word in list_iter(split_mcd(name, '.')) do
    _p = _p[word]
    if not _p then
      return error("attempting to call an invalid arbitrary method: " .. name)
    end
  end
  return _p(unpack(arg))
end

-- A multi-char delimiter string splitting routine.
-- Credit goes to Nick Gammon @ http://www.gammon.com.au/forum/?id=6079
function split_mcd(s, delim)
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
function list_iter(t)
  local i = 0
  local n = table.getn(t)
  return function ()
    i = i + 1
    if i <= n then return t[i] else return nil end
  end
end

ilist = list_iter -- alias


Algol = {}
-- Algol.start = function() end