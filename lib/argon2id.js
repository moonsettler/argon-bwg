import init, {argon2id_hash} from "./argon2id_wasm.js";

/**
 * Class representing Argon2id hashing operations.
*/
export default class Argon2id{

	/**
	 * Converts a hexadecimal string to a base64 string.
	 * @param {string} hexstring - The input hexadecimal string.
	 * @returns {string} The resulting base64 string.
	*/
	static hexToBase64(hexstring) {
		return btoa((hexstring.match(/\w{2}/g) || []).map(function(a) {
			return String.fromCharCode(parseInt(a, 16));
		}).join(""));
	}

	/**
	 * Converts a base64 string to a hexadecimal string.
	 * @param {string} str - The input base64 string.
	 * @returns {string} The resulting hexadecimal string.
	*/
	static base64ToHex(str) {
		const raw = atob(str);
		let result = '';
		for (let i = 0; i < raw.length; i++) {
			const hex = raw.charCodeAt(i).toString(16);
			result += (hex.length === 2 ? hex : '0' + hex);
		}
		return result.toUpperCase();
	}

	/**
	 * Generates a random number within a specified range.
	 * @param {number} min - The minimum value of the range.
	 * @param {number} max - The maximum value of the range.
	 * @returns {number} The generated random number.
	*/
	static randRange(min, max) {
		var range = max - min;
		var requestBytes = Math.ceil(Math.log2(range) / 8);
		if (!requestBytes) return min;

		var maxNum = Math.pow(256, requestBytes);
		var ar = new Uint8Array(requestBytes);

		while (true) {
			window.crypto.getRandomValues(ar);
			var val = 0;
			for (var i = 0;i < requestBytes;i++) val = (val << 8) + ar[i];
			if (val < maxNum - maxNum % range) return min + (val % range);
		}
	}

	/**
	 * Hashes a message using Argon2id.
	 * @param {string} message - The message to be hashed.
	 * @param {string} [salt] - The salt for hashing (default is a random salt).
	 * @param {number} [p=4] - The parallelism factor.
	 * @param {number} [m=16] - The memory cost in kilobytes.
	 * @param {number} [t=3] - The number of iterations.
	 * @param {number} [l=32] - The hash length in bytes.
	 * @returns {Promise<string>} A promise that resolves to the hashed message.
	*/
	static hash = (message, salt, p = 4, m = 16, t = 3, l = 32) => new Promise((res, rej) => {
		if(m <= 20) m = Math.pow(2, m);

		if(window.Worker){
			const Argon2idWorker = new Worker("./lib/argon2id_worker.js", { type: 'module' });

			Argon2idWorker.onmessage = ({data}) => {
				Argon2idWorker.terminate();
				if(data.error) rej(data.error);
				res(data.output);
			}

			Argon2idWorker.postMessage([message, salt, p, m, t, l]);
		}else{
      console.log('argon2id.js no window.Worker')
			init().then(() => {
				res(argon2id_hash(message, salt, p, m, t, l));
			}).catch(err => {
				rej(err);
			});
		}
	});

	/**
	 * Hashes a message and encodes it in a specific format.
	 * @param {string} message - The message to be hashed.
	 * @param {string} [salt] - The salt for hashing (default is a random salt).
	 * @param {number} [p=4] - The parallelism factor.
	 * @param {number} [m=16] - The memory cost in kilobytes.
	 * @param {number} [t=3] - The number of iterations.
	 * @param {number} [l=32] - The hash length in bytes.
	 * @returns {Promise<string>} A promise that resolves to the encoded hashed message.
	*/
	static hashEncoded = (message, salt = Argon2id.randomSalt(), p=4, m=16, t=3, l=32) => new Promise((res, rej) => {
		if(m <= 20) m = Math.pow(2, m);
		this.hash(message, salt, p, m, t, l).then(output => {
      console.log('hash output', output)
			res(`$argon2id$v=19$m=${m},t=${t},p=${p}$${btoa(salt).replaceAll("=", "")}$${this.hexToBase64(output).replaceAll("=", "")}`);
		}).catch(err => {
			rej(err);
		});
	});

	/**
	 * Decodes a hash encoded in a specific format and retrieves the hexadecimal digest.
	 * @param {string} hashEncoded - The encoded hash string.
	 * @returns {string} The hexadecimal digest.
	*/
	static hashDecode(hashEncoded){
		let digest = hashEncoded.split('$')[5];
		return this.base64ToHex(digest).toLowerCase();
	}
  
}