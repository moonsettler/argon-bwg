console.log('Script loaded');

function ensureArgon2Loaded() {
    return new Promise((resolve, reject) => {
        if (window.argon2Ready) {
            console.log('Argon2 already ready');
            resolve();
        } else {
            console.log('Waiting for Argon2 to be ready...');
            const checkReady = setInterval(() => {
                if (window.argon2Ready) {
                    clearInterval(checkReady);
                    console.log('Argon2 became ready');
                    resolve();
                }
            }, 100);

            // Add a timeout
            setTimeout(() => {
                clearInterval(checkReady);
                console.error('Timeout waiting for Argon2 to be ready');
                console.log('Module status:', window.Module);
                console.log('argon2Ready status:', window.argon2Ready);
                reject(new Error('Argon2 initialization timeout'));
            }, 20000); // 20 second timeout
        }
    });
}

document.getElementById('entropy').value = '';
document.getElementById('p').value = '2'; // Threads
document.getElementById('m').value = '1024'; // Memory KiB
document.getElementById('i').value = '3600'; // Iterations
document.getElementById('l').value = '32'; // Hash length
document.getElementById('size').value = '64'; // Hexadecimal digits

document.getElementById('file').addEventListener('change', hashfile);
document.getElementById('entropy').addEventListener('change', updateMnemonic);
document.getElementById('size').addEventListener('change', updateMnemonic);

async function hashPassword(message, salt, iterations, memory, parallelism, hashLength) {
    console.log('hashPassword called with:', { message, salt, iterations, memory, parallelism, hashLength });
    await ensureArgon2Loaded();
    console.log('Argon2 confirmed loaded in hashPassword');
    try {
        const argon2 = window.argon2;

        // Convert inputs to Uint8Array
        const messageArray = new TextEncoder().encode(message);
        const saltArray = new TextEncoder().encode(salt);

        console.log('Encoded messageArray:', messageArray);
        console.log('Encoded saltArray:', saltArray);

        // Allocate memory
        const messagePtr = argon2._malloc(messageArray.length);
        const saltPtr = argon2._malloc(saltArray.length);
        const hashPtr = argon2._malloc(hashLength);

        // Write data to memory
        argon2.HEAPU8.set(messageArray, messagePtr);
        argon2.HEAPU8.set(saltArray, saltPtr);

        console.log('Calling _argon2_hash with:', {
            iterations,
            memory,
            parallelism,
            messageLength: messageArray.length,
            saltLength: saltArray.length,
            hashLength
        });

        // Call the _argon2_hash function
        const result = argon2._argon2_hash(
            iterations,
            memory, // Memory should be in KiB
            parallelism,
            messagePtr,
            messageArray.length,
            saltPtr,
            saltArray.length,
            hashPtr,
            hashLength,
            0, // no encoded output
            2  // Argon2_id
        );

        console.log('Argon2 result code:', result);

        if (result !== 0) {
            const errorMessage = argon2.UTF8ToString(argon2._argon2_error_message(result));
            throw new Error(`Argon2 error: ${errorMessage} (code ${result})`);
        }

        // Read the result
        const hashArray = argon2.HEAPU8.slice(hashPtr, hashPtr + hashLength);
        console.log('Hash array:', hashArray);

        const hashHex = Array.from(hashArray, b => b.toString(16).padStart(2, '0')).join('');
        console.log('Hash hex:', hashHex);

        // Free allocated memory
        argon2._free(messagePtr);
        argon2._free(saltPtr);
        argon2._free(hashPtr);

        console.log('Argon2 hash result:', hashHex);
        return hashHex;
    } catch (e) {
        console.error('Error during Argon2 hashing:', e);
        throw e;
    }
}

document.getElementById('start').addEventListener('click', async () => {
    console.log('Generate button clicked');
    try {
        await ensureArgon2Loaded();
        console.log('Argon2 confirmed loaded');

        let message = document.getElementById('message').value;
        let salt = document.getElementById('salt').value;
        let p = parseInt(document.getElementById('p').value);
        let m = parseInt(document.getElementById('m').value);
        let i = parseInt(document.getElementById('i').value);
        let l = parseInt(document.getElementById('l').value);

        console.log('Inputs:', { message, salt, p, m, i, l });

        document.getElementById('entropy').value = '';
        document.getElementById('mnemonic').innerHTML = '';
        document.getElementById('perf').innerHTML = "Generating...";

        let timerStart = Date.now();
        console.log('Starting hash generation');
        const hashHex = await hashPassword(message, salt, i, m, p, l);
        console.log('Hash generated:', hashHex);
        let timerEnd = Date.now() - timerStart;

        let entropy = document.getElementById('entropy');
        entropy.value = hashHex;
        entropy.dispatchEvent(new Event('change'));

        document.getElementById('perf').innerHTML = `Generating the mnemonic took <b>${timerEnd}ms</b>.`;
    } catch (error) {
        console.error('Error during hash generation:', error);
        document.getElementById('perf').innerHTML = `Error: ${error.message}`;
    }
});

function updateMnemonic() {
    let hashHex = document.getElementById('entropy').value;
    let mnemonicSize = parseInt(document.getElementById('size').value);
    let mnemonics = { "english": new Mnemonic("english") };
    let mnemonic = mnemonics["english"];
    let entropy = hexToBytes(hashHex.substr(0, mnemonicSize));
    let words = mnemonic.toMnemonic(entropy);

    document.getElementById('mnemonic').innerHTML = words;
}

function hexToBytes(hex) {
    let bytes = [];
    for (let c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

function bytesToHex(bytes) {
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

function hashfile() {
    let fileselector = document.getElementById('file');
    if (fileselector.files.length === 0) {
        console.error('No file selected');
        return;
    }

    const file = fileselector.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const arrayBuffer = event.target.result;
        crypto.subtle.digest('SHA-256', arrayBuffer)
            .then(function(hash) {
                const hashArray = Array.from(new Uint8Array(hash));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                console.log('File SHA256:', hashHex);
                document.getElementById('message').value = hashHex;
            })
            .catch(function(error) {
                console.error('Error calculating SHA256:', error);
            });
    };

    reader.onerror = function(event) {
        console.error('File reading error:', event.target.error);
    };

    reader.readAsArrayBuffer(file);
}

function readbinaryfile(file) {
    return new Promise((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = () => {
            resolve(fr.result)
        };
        fr.readAsArrayBuffer(file);
    });
}
