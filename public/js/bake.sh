#!/usr/bin/env bash

FILES=(jquery-1.7.2.js PCREck.js jquery.autosize.js dynamism.js bootstrap/js/bootstrap.js)
uglifyjs ${FILES[@]} -o PCREck.min.js --stats --lint -c -m