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

# require 'rubygems'
# require 'bundler/setup'

# Bundler.require(:default)
require 'json'

RC_MATCH = 'RC_MATCH'
RC_NOMATCH = 'RC_NOMATCH'
RC_BADPATTERN = 'RC_BADPATTERN'

def match(pattern, subject, flags)
  rc, re = nil, nil

  if flags && !flags.empty?
    pattern = "(?#{flags}:#{pattern})"
  end

  begin
    re = Regexp.compile(pattern)
  rescue Exception => e
    return {
      status: RC_BADPATTERN,
      error: e.message
    }.to_json
  end

  match = re.match(subject)

  if !match.nil?
    rc = {
      status: RC_MATCH,
      offset: [ match.begin(0), match.end(0) ],
      captures: (1..match.length-1).map do |i|
        [ match.begin(i), match.end(i) ]
      end
    }
  else
    rc = {
      status: RC_NOMATCH
    }
  end

  rc
end

def write(msg, stream=STDOUT)
  stream.puts(msg)
  stream.flush
end

write "ready"

while input = STDIN.gets
  decoded_input = ::JSON.parse(input)
  write match(
    decoded_input['pattern'].to_s,
    decoded_input['subject'].to_s,
    decoded_input['flags'].to_s
  ).to_json
end
