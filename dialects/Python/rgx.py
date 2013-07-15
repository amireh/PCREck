#!/usr/bin/env python
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

import re
import json
import argparse
from bottle import error, HTTPError, get, post, request, route, run

@error(400)
def error400(err):
  err.content_type = 'application/json'
  return json.dumps({ 'error': "{0}".format(err.body) })

@get('/flags')
def flags():
  return {
    'i': 'Ignore case',
    'L': 'Locale dependent',
    'm': 'Multi-line',
    's': 'dot matches all',
    'u': 'Unicode dependent'
  }

@post('/')
def test():
  try:
    params = request.json
  except ValueError:
    raise HTTPError(400, "Bad JSON data.")

  print(request.json)
  print()

  ptrn  = request.json['pattern']
  flags = request.json['flags']

  if flags:
    ptrn = '(?' + flags + ')' + ptrn;

  try:
    ptrn  = re.compile(ptrn)
  except Exception as e:
    return {
      'status': 'RC_BADPATTERN',
      'error':  "{0}".format(e)
    }

  subj  = request.json['subject']

  match = ptrn.match(subj)

  if match:
    out = {
      'status': 'RC_MATCH',
      'offset': match.span(),
      'captures': []
    }

    print(out)

    for i in range(1, match.lastindex+1):
      out['captures'].append({
        'position': match.start(i),
        'string': match.group(i)
      })

    print(out)
    return out;
  else:
    return { 'status': 'RC_NOMATCH' }


parser = argparse.ArgumentParser(description='A Python rgx dialect engine.')
parser.add_argument('host', help='the interface to bind to', action='store')
parser.add_argument('port', help='the port to bind to', type=int, action='store')

args = vars(parser.parse_args())

run(host=args['host'], port=args['port'], debug=True)
