# `titan`

Named after the first private server I've ever played, `titan` is a library of Node.js modules that helps bring MapleStory private server development to the `npm` ecosystem.

* Note this project is in early development, use with caution

# Overview

## Core Packages
* calc

A calculator library that implements standard MapleStory specific calculations such as damage, stat modifiers, experience, and levels.

```node
const calc = require('@titan/calc');

/** Example player stats object */
const playerStats = {base: {str: 4, ...}, hyper: {str: 1, ...}};

/** crypto.calc example */
const modifiedStats = calc.HyperStats(playerStats).applyAll().get();

/** Returns {str: 34, ...} */
```

* crypto

A cryptography library that exposes everything you need to encrypt/decrypt data for MapleStory.

```node
const crypto = require('@titan/crypto');

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

* net

A packet parser using method-chaining syntax for compact and efficient parsing/writing of packet structures.

```node
const net = require('@titan/net');

/** Example buffer */
const data = Buffer.from([1, 2]);

/** crypto.Packet example */
const packet = new net.Packet.Parser(data);
const fields = ['id', 'name', 'hp'];
const unpacked = packet.int().mapleascii().int().collect(fields);

/** Returns {id: <number>, name: <string>, hp: <number>} */

/** crypto.Writer example */

/** Initialize with length */
let packet = new net.Packet.Writer(5);
packet = packet.byte(0x0).int(9).buffer();

/** Returns the buffer with data */

```

* wz

A WZ library that can read and write to the WZ file format.

## Neat Features
* Uses Google's recommended JS style guidelines, fully documented code including full JSDoc comments
* Everything is tested and modular, so only use the modules that you want!

# Project Goals

## MapleStory-related Packages
* Cryptography
* Networking protocol
* Damage calculations
* Event timers
* NPC script manager
* Event script manager
* Support WZ and NX file formats
* Generic MapleStory abstractions
* Multiple MapleStory versions

# Project Overview

## Linter

```
npm run lint
```

## Test

```
npm run test
```

# Contributing

For now, there are no contribution guidelines. I only ask that you follow the `eslint` rules when contributing a pull request. Thanks!

[![ForTheBadge built-with-love](http://ForTheBadge.com/images/badges/built-with-love.svg)](https://GitHub.com/Naereen/)