# Argon BWG
## Border Wallet Generator utilizing Argon2id

## How to verify the dependencies used
* **Argon2id-JS by Rabbit-Company**

Repository: https://github.com/moonsettler/Argon2id-JS/tree/e3f0679f8db6052767f1c2c704a1739e535be26b

Origin: https://github.com/Rabbit-Company/Argon2id-JS/tree/e3f0679f8db6052767f1c2c704a1739e535be26b

File | SHA256 | State
---|---|---
Argon2id.min.js | f06dd275837c432bc5013a4398f3d4af4378591ab1283ef513e8f3a9c2ed0a84 | Unchanged
Argon2idWorker.min.js | 01fdb3514132314a798910c70245d55896546ab57c32dd35f616c4faedaf50ae | Unchanged

* **bip39 by iancoleman**

Repository: https://github.com/moonsettler/bip39-iancoleman/tree/e2fdc5b9420fe45a255776f0caa6df8b0baf4a2c

Origin: https://github.com/iancoleman/bip39/tree/e2fdc5b9420fe45a255776f0caa6df8b0baf4a2c

File | SHA256 | State
---|---|---
sjcl-bip39.js | c86ce24dc5ca9cff01acad425ceec34480776d8dd5918c0e837bb7bf09957eed | Unchanged
jsbip39.js | f2c978ca6366f0d0373f08a74795b94b4f24eda3792dbcdbf2664e7db9939846 | Unchanged
jsbip39.js | f068804e78f724b52f6a8255ccf18ff946e69d225fbc1dfabb96071a7db69de6 | Changed
wordlist_english.js | dc15bb8884d53e589c3f3b37c8e369b16e307690038b6ad473f5c9503105b285 | Unchanged

*Since random mnemonic generation is not used, and it would bring in several additional dependencies the following lines were altered in jsbip39.js:*

**Unchanged jsbip39.js**
```javascript
var Mnemonic = function(language) {

    var DOM = {};
    DOM.entropyContainer = $(".entropy-container");
    PBKDF2_ROUNDS = DOM.entropyContainer.find(".pbkdf2-rounds").val();
    var RADIX = 2048;
```
**Changed jsbip39.js**
```javascript
var Mnemonic = function(language) {

    PBKDF2_ROUNDS = 2048;
    var RADIX = 2048;
```