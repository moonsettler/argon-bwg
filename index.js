document.getElementById('entropy').value = '';
document.getElementById('p').value = '2';		// Threads
document.getElementById('m').value = '1024';	// Memory KiB
document.getElementById('i').value = '3600';	// Iterations
document.getElementById('l').value = '32';		// Hash length
document.getElementById('size').value = '64';	// Hexadecimal digits

document.getElementById('file').addEventListener('change', hashfile);
document.getElementById('entropy').addEventListener('change', updateMnemonic);
document.getElementById('size').addEventListener('change', updateMnemonic);

document.getElementById('start').addEventListener('click', () => {
	let message = document.getElementById('message').value;
	let salt = document.getElementById('salt').value;
	let p = document.getElementById('p').value;
	let m = document.getElementById('m').value;
	let i = document.getElementById('i').value;
	let l = document.getElementById('l').value;
	let secret = '';
	let associatedData = '';

	message = bytesToHex(hexToBytes(message));
	document.getElementById('message').value = message;
	document.getElementById('entropy').value = '';
	document.getElementById('mnemonic').innerHTML = '';
	document.getElementById('perf').innerHTML = "Generating...";

	let timerStart = Date.now();
	Argon2id.hashEncoded(message, salt, i, m, p, l, secret, associatedData).then(hashEncoded => {
		let hashHex = Argon2id.hashDecode(hashEncoded);
		let timerEnd = calcT(timerStart);
		
		let entropy = document.getElementById('entropy');
			entropy.value = hashHex;
			entropy.dispatchEvent(new Event('change'));
			
		document.getElementById('perf').innerHTML = "Generating the mnemonic took <b>" + timerEnd + "ms</b>.";
	});
});

function updateMnemonic() {
	let hashHex = document.getElementById('entropy').value;
	let mnemonicSize = document.getElementById('size').value;
	let mnemonics = { "english": new Mnemonic("english") };
	let mnemonic = mnemonics["english"];
	let entropy = hexToBytes(hashHex.substr(0, mnemonicSize));
	let words = mnemonic.toMnemonic(entropy);

	document.getElementById('mnemonic').innerHTML = words;
}

function calcT(timer){
	return Date.now() - timer;
}

// Convert a hex string to a byte array
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

// Convert a byte array to a hex string
function bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xF).toString(16));
    }
    return hex.join("");
}

// Calculate SHA256 of a file selected
function hashfile() {
	let fileselector = document.getElementById('file');
	readbinaryfile(fileselector.files[0])
		.then(function (result) {
			result = new Uint8Array(result);
			return window.crypto.subtle.digest('SHA-256', result);
		}).then(function (result) {
			result = new Uint8Array(result);
			var resulthex = bytesToHex(result);
			document.getElementById('message').value = resulthex;
		});
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