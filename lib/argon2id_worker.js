importScripts("argon2.js");

onmessage = (e) => {
  argon2.hash(e.data).then(hash => postMessage({ hash })).catch(error => postMessage({error}));
}