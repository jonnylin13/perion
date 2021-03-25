const Protocol = require('../src/protocol/protocol.js');
const Delegator = require('../src/delegator.js');
const assert = require('assert');
describe('@perion/net.Protocol', function() {
  it('should load internal.proto.json and build a packet', function() {
    const proto = new Protocol(['internal.proto.json']);
    const pongPacket = proto.build('internal.pong', []);
    assert(pongPacket.compare(Buffer.from([0x01, 0x04])) === 0);
  });
  it('should attempt to load nonexistent file', function() {
    try {
      const proto = new Protocol(['interna.proto.json']);
    } catch (err) {
      assert(err !== null && err !== undefined);
    }
  });
  it('should attempt to build nonexistent message', function() {
    try {
      const proto = new Protocol(['internal.proto.json']);
      proto.build('fake', []);
    } catch (err) {
      assert(err !== null && err !== undefined);
    }
  });
  it('should attempt to build with wrong input values', function() {
    try {
      const proto = new Protocol(['internal.proto.json']);
      proto.build('internal.custom', []);
    } catch (err) {
      assert(err !== null && err !== undefined);
    }
  });
  it('should build custom packet', function() {
    const proto = new Protocol(['internal.proto.json']);
    const packet = proto.build(
      'internal.custom', [1, 1, 1, BigInt(2), "test", "test", "test"]
    );
    assert(packet.compare(Buffer.from([
      0x02, 0x04, 0x01, 0x01, 0x00, 0x01, 0x00, 0x00,
      0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
      0x00, 0x74, 0x65, 0x73, 0x74, 0x74, 0x65, 0x73, 
      0x74, 0x00, 0x04, 0x00, 0x74, 0x65, 0x73, 0x74
    ])) === 0);
    const delegator = new Delegator('/handlers/', proto);
    const result = delegator.delegate({
      packet: {
        data: packet,
        opcode: 0x402
      },
      socket: {
        encWrite: () => true
      }
    });
    assert.deepEqual(result, {
      byte: 1,
      short: 1,
      int: 1,
      long: BigInt(2),
      ascii: 'test',
      nullascii: 'test',
      mapleascii: 'test'
    });
  });
  it('should try to build test packet', function() {
    try {
      const proto = new Protocol(['internal.proto.json']);
      const packet = proto.build(
        'internal.test', [1]
      );
    } catch (err) {
      assert(err !== null && err !== undefined);
    }
  });
});