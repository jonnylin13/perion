const assert = require('assert');
const Packet = require('../packet');
describe('packet.js Parser', function() {
  it('should read a byte', function() {
    const packet = new Packet.Parser(Buffer.from([0x2]));
    const byte = packet.byte().parsed[0];
    assert.strictEqual(byte, 2);
  });
});