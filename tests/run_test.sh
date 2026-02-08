#!/bin/bash
php -S localhost:8000 > /dev/null 2>&1 &
PID=$!
sleep 2

python3 tests/test_a11y.py
EXIT_CODE=$?

kill $PID
exit $EXIT_CODE
