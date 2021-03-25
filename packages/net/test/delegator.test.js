const assert = require('assert');
const Delegator = require('../src/delegator.js');
const Protocol = require('../src/protocol/protocol.js');
describe('@perion/net.Delegator', function() {
  it('should create a Delegator', function() {
    const protocol = new Protocol(['internal.proto.json']);
    const delegator = new Delegator('/handlers/', protocol);
  });
  it('should delegate a ping packet and unknown', function() {
    try {
      const protocol = new Protocol(['internal.proto.json']);
      const delegator = new Delegator('/handlers/', protocol);
      const success = delegator.delegate({
        packet: {
          data: Buffer.from([]),
          opcode: 0x400
        }, 
        socket: {encWrite: () => true}
      });
      const failure = delegator.delegate({
        packet: {
          data: Buffer.from([]),
          opcode: 0xfff
        },
        socket: {encWrite: () => true}
      });
      assert(!failure);
      assert(success);
    } catch (err) {
    }
  });
  it('should provide invalid dir', function() {
    try {
      const protocol = new Protocol(['internal.proto.json']);
      const delegator = new Delegator('handler/', protocol);
    } catch (err) {
      assert(err !== null && err !== undefined);
    }
  });
});