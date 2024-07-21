#!/bin/bash

# URLs for the WASM files
ARGON2_JS_URL="https://raw.githubusercontent.com/antelle/argon2-browser/master/docs/dist/argon2.js"
ARGON2_WASM_URL="https://raw.githubusercontent.com/antelle/argon2-browser/master/docs/dist/argon2.wasm"

# Download the files
curl -o argon2.js $ARGON2_JS_URL
curl -o argon2.wasm $ARGON2_WASM_URL

echo "WASM files downloaded successfully."
