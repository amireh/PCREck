#!/usr/bin/env bash

valgrind --show-reachable=yes --leak-check=full --log-file=./valgrind.out ./dakwakd
