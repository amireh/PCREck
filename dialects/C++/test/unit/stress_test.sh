#!/usr/bin/env bash

# sends a batch of concurrent requests to dakapi with XML data found in a file

if [ $# -lt 3 ]; then
  echo "usage: ./stress_test.sh HTML_FILE [nr_requests] [concurrency_lvl] [URL] [APIKey] [To-Lang]"
  echo "filename must point to a JSON file with the request data"

  exit
fi

time ab -vvv -p $1 \
-n $2 \
-c $3 \
-T "text/html" \
-H "Dakwak-APIKey: $5" \
-H "Dakwak-ToLang: $6" \
-r http://localhost:9090$4
