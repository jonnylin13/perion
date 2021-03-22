# `@perion/net`

A library for manipulating MapleStory packets.

## Installation

```
npm i --save @perion/net
```

## Usage

```node
const net = require('@perion/net');

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