const net = require('../index.js');
const crypto = require('@perion/crypto');
const assert = require('assert');
describe('@perion/net.Encoder', () => {
  it('should encode and decode a packet', function() {
    const iv = Buffer.from([0x1, 0x2, 0x3, 0x4]);
    let packet = new net.Packet.Writer(2);
    packet = packet.byte(0).byte(0).buffer();
    const send = new crypto.AES(iv, 83);
    const recv = new crypto.AES(Buffer.from([0x1, 0x2, 0x3, 0x4]), 83);
    const encoder = new net.Packet.Encoder({aes: send, shanda: crypto.Shanda});
    const decoder = new net.Packet.Encoder({aes: recv, shanda: crypto.Shanda});
    const encoded = encoder.encode(packet);
    const decoded = decoder.decode(encoded, false);
    assert.deepEqual(decoded.data, Buffer.from([0x00, 0x00]));
  });
});