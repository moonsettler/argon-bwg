#!/bin/bash

# Clone and set up Emscripten SDK
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
cd ..

# Clone the Argon2 repository
git clone https://github.com/P-H-C/phc-winner-argon2.git
cd phc-winner-argon2

# Compile Argon2 to WebAssembly
emcc -Iinclude -O3 -s WASM=1 -s MODULARIZE=1 \
-s 'EXTRA_EXPORTED_RUNTIME_METHODS=["cwrap", "UTF8ToString"]' \
-s 'EXPORTED_FUNCTIONS=["_argon2_hash", "_argon2_error_message", "_malloc", "_free"]' \
-o argon2.js src/argon2.c src/core.c src/blake2/blake2b.c src/thread.c src/encoding.c src/ref.c

# Move the generated files to the parent directory
mv argon2.js ../
mv argon2.wasm ../

# Go back to the parent directory
cd ..

# Clean up
rm -rf emsdk phc-winner-argon2

echo "WASM files compiled and moved to the project root successfully."
