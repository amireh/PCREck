#!/usr/bin/env bash

# simulates a client request to the daemon using CURL with HTML data found in a file

if [ $# -lt 1 ]; then
  echo "usage: ./html_request.sh filename [URL] [APIKey] [To-Lang]"
  echo "filename must point to an HTML file with the request data"

  exit
fi

URL=$2
APIKEY=$3
TOLANG=$4

if [ $# -lt 3 ]; then
  APIKEY="4e23f3440517b513760000024e22bd6a0517b54b8b000005"
fi
if [ $# -lt 4 ]; then
  TOLANG="ar"
fi

STAMP=`date +%s`

curl -X POST -d @$1 \
-H "Content-Type: text/html" \
-H "dakwak-APIKey: ${APIKEY}" \
-H "dakwak-ToLang: ${TOLANG}" \
-H "dakwak-UUID: ${STAMP}" \
 http://localhost:9090/$URL
