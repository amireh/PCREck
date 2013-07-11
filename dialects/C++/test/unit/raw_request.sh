#!/usr/bin/env bash

# simulates a client request to the daemon using CURL with JSON data found in a file

if [ $# -lt 1 ]; then
  echo "usage: ./raw_request.sh filename"
  echo "filename must point to a raw HTTP request file with a JSON or XML body"

  exit
fi

cat $1 | nc localhost 9090
