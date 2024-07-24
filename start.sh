#!/bin/bash
# Init script variables
HOST="http://localhost:8000"
DIR=$( cd -P "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )
echo '--------------------------------------------------------------------------------'
echo '-             Argon BWG - Border Wallet Generator v0.2 (WASM)                  -'
echo '--------------------------------------------------------------------------------'
echo HTTP Host: $HOST
echo Directory: $DIR
echo 'Press Ctrl+C to stop the HTTP Server!'
echo '--------------------------------------------------------------------------------'
 
# Set Working Directory to script location
cd ''$DIR''
 
# Open App Site in OS default browser
xdg-open ''$HOST''
 
# Ubuntu comes with Python 3.x
if type -t 'python3' > /dev/null; then
python3 -m http.server 8000
exit 0
fi
 
# Tails OS comes with Python 2.7.16
if type -t 'python' > /dev/null; then
python -m SimpleHTTPServer 8000
exit 0
fi
 
echo 'Python installation not found!'
exit 1
