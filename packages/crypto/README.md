# `@perion/crypto`

A library for encrypting/decrypting MapleStory packets.

## Installation

```
npm i --save @perion/crypto
```

## Usage

```node
const crypto = require('@perion/crypto');

/** Example data */
const payload = Buffer.from([0x1]);
const sendIv = Buffer.from([0x0, 0x2, 0x3, 0x4]);
const recvIv = Buffer.from([0x4, 0x2, 0x1, 0x0]);

/** crypto.Shanda example */
const encrypted = crypto.Shanda.encrypt(payload);
const decrypted = crypto.Shanda.decrypt(payload);

/** Returns the input buffer with the payload encrypted/decrypted using Maple Custom Shanda */

/** crypto.AES example */
/**
  * You must initialize the AES class with:
  * - an IV (Initialization Vector)
  * - a MapleStory version number
  *
  * The IV must have a length of 4
  * As the server, you must send the IV for both send and recv to the client
  */
const sendAES = new crypto.AES(sendIv, 83);
const recvAES = new crypto.AES(recvIv, 83);

const encryptedOut = sendAES.transform(payload);
const decryptedIn = recvAES.transform(payload);

/** Returns the input buffer with the payload encrypted/decryped using Maple AES */
```