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
* json4lua
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

Regarding my own code, it's free to use, re-distribute, and modify. 

Feel free to host PCREck on your own intranet server. That's mainly the reason I'm sharing
the application; I'm hosting it on my small private server and might not be able
to accomodate all the traffic.

Finally, if you find it useful and use it in any way, please drop me a message on my email. :)