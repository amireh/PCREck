#!/usr/bin/env lua
------------------
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

print(cli.version)
cli:set_name("PCREck")
cli:add_opt("--pattern=PTRN", "PCRE regular expression pattern", nil, ".*")
cli:add_opt("--subject=TEXT", "subject to test using the pattern", "subject", "")
cli:add_flag("--compact", "output will be compact")
cli:add_flag("--raw", "pattern and subject will be treated as raw instead of JSON")
cli:add_flag("-d, --daemonize", "run PCREck as a daemon")
cli:add_opt("-i, --interface", "the interface to bind to when daemonized", "interface", "127.0.0.1")
cli:add_opt("-p, --port", "the port to bind to when daemonized", "port", 8942)
cli:add_opt("-c, --concurrency", "the maximum number of clients at any time", nil, 256)

local args = cli:parse_args(true)
if not args then return end

require 'rex_pcre'
local json = require 'json'

function test_subject(pattern, subject, dont_decode)
  print("Testing pattern: [" .. pattern .. "]")
  print("Testing subject: [" .. subject .. "]")

  if not dont_decode then
    pattern = json.decode(pattern)
    subject = json.decode(subject)
  end

  local success, rex_or_msg = pcall(rex_pcre.new, pattern)
  if not success then
    return nil, "invalid regular expression; " .. rex_or_msg
  end


  return { rex_pcre.find(subject, rex_or_msg) }
end

if not args["d"] then
  local encoded, err = test_subject(args["pattern"], args["subject"], args["raw"])

  if args["compact"] then
    if encoded then
      print(json.encode(encoded))
    else
      print(json.encode( { error = err }))
    end

    return
  end

  if encoded and #encoded >= 2 then
    print("Matched at [" .. encoded[1] .. "," .. encoded[2] .. "]")
    print("Captures:")
    for k,v in pairs(encoded) do
      if k > 2 then
        print("  %" .. k - 2  .. " => " .. v)
      end
    end
  else
    print(err)
  end
  return
end

-- daemonized mode
print("Running in daemon mode")
package.cpath = "/usr/local/lib/?.so;" .. package.cpath

local socket = require 'socket'
local signal = require 'signal'

local conn, err = socket.tcp()
if not conn then
  return print(err)
end

local _, err = conn:bind("127.0.0.1", 8942)
if (not _) or err then
  print("Unable to bind: " .. err)
end

local server = conn
server:listen(512)
server:setoption("keepalive", true)
server:setoption("tcp-nodelay", true)
server:setoption("reuseaddr", true)
server:settimeout(0)

running = true
signal.signal("INT", function()
  print("SIGINT was received - shutting down")
  conn:close()
  running = false
end)


while running do
  local client = nil
  repeat
    client, err = server:accept()

    if not client then
      if err and err ~= "timeout" then
        print("ERROR: " .. err)
      end
      break
    end

    local data,err,partial = client:receive('*l')

    if err and err ~= "timeout" then
      print("ERROR: " .. err)
      break
    end

    local d = (data or "") .. (partial or "")
    -- print(d)

    local decoded = json.decode(d)
    if not decoded then
      print("bad JSON data: " .. d .. ", ignoring")
      break
    end

    local ptrn = decoded[1]
    local str = decoded[2]

    -- local res, msg = pcall(rex_pcre.new, ptrn)
    local encoded, err = test_subject(ptrn, str)
    if not encoded then
      client:send(json.encode( { error = err }))
      break
    end

    client:send( json.encode(encoded) )
  until true

  if client then
    client:close()
    client:shutdown("both")
    client = nil
  end
end

conn:close()