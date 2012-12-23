# PCREck

An interface for writing and checking [PCRE](http://www.pcre.org) regular expressions.
[PCREck](http://www.pcreck.com) is similar to what [Rubular](http://www.rubular.com) is for Ruby's regexes.

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
the HTML interface, and `POST '/'` for invoking `PCREck.lua` in
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

Feel free to host PCREck on your own intranet server. I'm hosting it on my humble private server which might not be able
to accomodate all the traffic.

The code is released under the MIT terms.

Copyright (c) 2011-2012 Ahmad Amireh

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
