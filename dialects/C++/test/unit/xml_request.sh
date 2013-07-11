#!/usr/bin/env bash

# simulates a client request to the daemon using CURL with JSON data found in a file

if [ $# -lt 1 ]; then
  echo "usage: ./xml_request.sh filename"
  echo "filename must point to a XML file with the request data"

  exit
fi

curl -X POST -d @$1 \
-H "Content-Type: application/xml" \
-H "Dakwak-APIKey: 4f1d7ca149bd1302a70000064f1d7bcc49bd1379bb00002e" \
-H "Dakwak-ToLang: ar" \
-H "Dakwak-TID: 1" \
 http://localhost:9090
