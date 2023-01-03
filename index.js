document.getElementById('message').value = '5C3044FE3445452CC3C5A166D1EFF67182AD799362CFD207033F2DFFF1058868';
document.getElementById('salt').value = 'silver basic have size pill labor';
document.getElementById('p').value = '2';
document.getElementById('m').value = '1024';
document.getElementById('i').value = '60';
document.getElementById('l').value = '32';

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

	let timerStart = Date.now();
	Argon2id.hashEncoded(message, salt, i, m, p, l, secret, associatedData).then(hashEncoded => {
		let hashHex = Argon2id.hashDecode(hashEncoded);
		let timerEnd = calcT(timerStart);
		document.getElementById('hash').innerHTML = "<b>Entropy:</b> " + hashHex;
		document.getElementById('perf').innerHTML = "Generating the mnemonic took <b>" + timerEnd + "ms</b>.";

		let mnemonics = { "english": new Mnemonic("english") };
		let mnemonic = mnemonics["english"];
		let entropy = hexToBytes(hashHex);
		let words = mnemonic.toMnemonic(entropy);

		document.getElementById('mnemonic').innerHTML = words;
	});
});

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