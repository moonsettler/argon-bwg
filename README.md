# Argon BWG
### Bip-39 Border Wallet Generator utilizing Argon2id

## Motivation
When memorized, bip-39 mnemonic wallets are resistant to invasive searches. Good quality large size entropy is key to secure bitcoin or other cryptoassets. Those are very hard to memorize and recall later with a high degree of confidence.

## Abstract
Argon BGW is made for generating bip-39 mnemonic wallets from the SHA256 hash of an ubiquitous high quality entropy source like a camera captured picture file, and a moderately strong passphrase that is easier to remember trading passphrase strenght for extreme computational cost.

## Caution!
**WARNING:** The **file** used as entropy base **needs to be the same bit by bit** to generate the same mnemonic! Many web services will alter image files uploaded to them routinely, resizing them, or removing metadata. Such actions will completely change the SHA256 fingerprint of the file!

The **24 word mnemonic seed backup** is the only feasible way to **restore the wallet and recover assets** in case the file or the passphrase is lost!

## Parameters
The goal was, that generating the mnemonic wallet from entropy source and passphrase should take in the ballpark of 1 hour. For this purpose the following Argon2id parameters were choosen:
- Message: File hash (lowercase)
- Salt: Passphrase (lowercase)
- Parallelism Factor: 2
- Memory Cost: 1024
- Iterations: 3600
- Output Length: 32 bytes (256 bits)

## How to use?

1. Download the argon-bwg offline static webpage from github!
2. Choose a file, like a picture you took as the main entropy source!
3. Choose a passphrase or random generate 6 words and memorize them!
4. Run argon-bwg under Tails or other live os offline!
5. Select the file, or manually enter the SHA256 hash!
6. Enter the passphrase next!
7. Press "Generate"! It will take a while, on an average PC about an hour.
8. Finally it displays 12/24 word Mnemonic Wallet.
9. Note down your words and keep them secure!
10. Enter your 12/24 words into a hardware or software wallet of your choosing, to receive and spend!

## How to verify the dependencies used?
### **Argon2id-JS by Rabbit-Company**

Repository: https://github.com/moonsettler/Argon2id-JS/tree/e3f0679f8db6052767f1c2c704a1739e535be26b

Origin: https://github.com/Rabbit-Company/Argon2id-JS/tree/e3f0679f8db6052767f1c2c704a1739e535be26b

File | SHA256 | State
---|---|---
/Argon2id.min.js | f06dd275837c432bc5013a4398f3d4af4378591ab1283ef513e8f3a9c2ed0a84 | Unchanged
/Argon2idWorker.min.js | 01fdb3514132314a798910c70245d55896546ab57c32dd35f616c4faedaf50ae | Unchanged

### **bip39 by iancoleman**

Repository: https://github.com/moonsettler/bip39-iancoleman/tree/e2fdc5b9420fe45a255776f0caa6df8b0baf4a2c

Origin: https://github.com/iancoleman/bip39/tree/e2fdc5b9420fe45a255776f0caa6df8b0baf4a2c

File | SHA256 | State
---|---|---
/src/js/sjcl-bip39.js | c86ce24dc5ca9cff01acad425ceec34480776d8dd5918c0e837bb7bf09957eed | Unchanged
/src/js/jsbip39.js | f2c978ca6366f0d0373f08a74795b94b4f24eda3792dbcdbf2664e7db9939846 | Unchanged
/src/js/jsbip39.js | f068804e78f724b52f6a8255ccf18ff946e69d225fbc1dfabb96071a7db69de6 | Changed
/src/js/wordlist_english.js | dc15bb8884d53e589c3f3b37c8e369b16e307690038b6ad473f5c9503105b285 | Unchanged

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