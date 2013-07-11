# rgx

An interface for writing and checking [PCRE](http://www.pcre.org) regular expressions.
[rgx](http://www.rgx.com) is similar to what [Rubular](http://www.rubular.com) is for Ruby's regexes.

## The Lua part

Uses [lrexlib-pcre](http://rrthomas.github.com/lrexlib/manual.html) to test a PCRE
pattern on a subject.

The script can be invoked with a pattern and a subject to
test and the results will be thrown out to STDOUT in either
readable, formatted way (default) or a compact one (--compact).

The script can also be daemonized (-d) to accept newline-delimited
JSON array messages that contain the pattern as the first element
and the subject as the second one.

**Dependencies**

You can get all the dependencies using [luarocks](http://www.luarocks.org/). They are:

* lrexlib-pcre
* lua_cliargs
* dkjson
* luasocket (only when using the daemonized mode)
* luasignal (only when using the daemonized mode)

## The Ruby part

A minial Sinatra Ruby server that accepts `GET '/'` for displaying
the HTML interface, and `POST '/'` for invoking `rgx.lua` in
the compact mode and passing the result back as JSON.

**Dependencies**

* the Sinatra gem
* dm-core
* dm-migrations
* dm-mysql-adapter

## The HTML interface

It's composed of a simple HTML view and a CSS file. The only JavaScript
dependency is jQuery.

I plan on using WebSockets instead of AJAX for querying later on at which
point the jQuery dependency can be safely removed.

## Licensing

This file is part of rgx.

rgx is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

rgx is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with rgx. If not, see <http://www.gnu.org/licenses/>.