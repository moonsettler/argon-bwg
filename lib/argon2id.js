/**
 * Class wrapping Antelle Argon2id hashing operations to appropriately leverage web worker.
*/
class Argon2id{

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

    let params = {
      pass: message,
      salt,
      time: t, // the number of iterations
      mem: m, // used memory, in KiB
      hashLen: l, // desired hash length
      parallelism: p, // desired parallelism (it won't be computed in parallel, however)
      type: argon2.ArgonType.Argon2id, // Argon2d, Argon2i, Argon2id
    }

		if(window.Worker){
			const Argon2idWorker = new Worker("./lib/argon2id_worker.js");

			Argon2idWorker.onmessage = ({data}) => {
				Argon2idWorker.terminate();
				if(data.error) rej(data.error);
				res(data.hash);
			}

			Argon2idWorker.postMessage(params);
		} else {
      argon2.hash(params).then(hash => res(hash)).catch(e => rej(e));
		}
	});

}