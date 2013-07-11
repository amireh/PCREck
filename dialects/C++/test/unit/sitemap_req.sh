#!/usr/bin/env bash

# simulates a client request to the daemon using CURL with JSON data found in a file

if [ $# -lt 1 ]; then
  echo "usage: ./sitemap_req.sh filename"
  echo "filename must point to a XML file with the request data"

  exit
fi

curl -X POST -d @$1 \
-H "Content-Type: application/xml" \
-H "Dakwak-APIKey: 4c320675d1748267bb0001274c320675d1748267bb000125" \
-H "Dakwak-ToLang: ar" \
-H "Dakwak-UUID: `date +%s`" \
 http://localhost:9090/sitemap.xml
