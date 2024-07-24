// import init, {argon2id_hash} from "./argon2id_wasm.js";
// import argon2 from "./argon2.js";

// console.log('argon2', argon2)

onmessage = (e) => {
  console.log(e)
  // params = e.data
  // params.type = argon2.ArgonType.Argon2id
  // argon2.hash(e.data).then(hash => postMessage({ hash })).catch(error => postMessage({error}));
	// init().then(() => {
	// 	postMessage({ output: argon2id_hash(e.data[0], e.data[1], e.data[2], e.data[3], e.data[4], e.data[5]) });
	// }).catch(error =>{
	// 	postMessage({error})
	// });
}