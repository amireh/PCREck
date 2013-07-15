#!/usr/bin/env ruby
#
# -----------------------------------------------------------------------------
# This file is part of rgx.
#
# rgx is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# rgx is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with rgx. If not, see <http://www.gnu.org/licenses/>.
# -----------------------------------------------------------------------------

require 'rubygems'
require 'bundler/setup'

Bundler.require(:default)

RC_MATCH = 'RC_MATCH'
RC_NOMATCH = 'RC_NOMATCH'
RC_BADPATTERN = 'RC_BADPATTERN'

configure do
  set :protection, :except => [ :http_origin ]
end

before do
  if (request.accept || '').to_s.include?('json')
    request.body.rewind
    body = request.body.read.to_s || ''
    unless body.empty?
      begin;
        params.merge!(::JSON.parse(body))
        # puts params.inspect
        # puts request.path
      rescue ::JSON::ParserError => e
        puts e.message
        puts e.backtrace
        halt 400, "Malformed JSON content"
      end
    end
  end
end

Flags = {
  'i' => 'Ignore case',
  'm' => 'Treat a newline as a character matched by .',
  'x' => 'Ignore whitespace and comments in the pattern'
}

get '/flags', provides: [ :json ] do
  Flags.to_json
end

post '/', provides: [ :json ] do
  ptrn = params[:pattern]
  subj = params[:subject]
  flags = params[:flags]
  rc, re = nil, nil

  puts params.inspect

  if !ptrn || !subj then
    halt 400, "Missing pattern "
  end

  if flags && !flags.empty?
    ptrn = "(?#{flags}:#{ptrn})"
  end

  begin re = Regexp.compile(ptrn)
  rescue Exception => e
    return {
      status: RC_BADPATTERN,
      error: e.message
    }.to_json
  end

  if match = re.match(subj)
    rc = {
      status: RC_MATCH,
      offset: [ match.begin(0), match.end(0) ],
      captures: []
    }

    for i in (1..match.length-1) do
      rc[:captures] << {
        position: match.begin(i),
        string:   match[i]
      }
    end
  else
    rc = {
      status: RC_NOMATCH
    }
  end

  rc.to_json
end