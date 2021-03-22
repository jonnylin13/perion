const assert = require('assert');
const net = require('../index.js');
const crypto = require('../../crypto/index.js');
describe('@titan/net.Packet.Parser', function() {
  it('should read a byte, ubyte', function() {
    const packet = new net.Packet.Parser(Buffer.from([0x2, 0x2]));
    const data = packet.byte().ubyte().collect(['val1', 'val2']);
    assert.strictEqual(data.val1, 0x2);
    assert.strictEqual(data.val2, 0x2);
  });
  it('should read a few bytes and collect', function() {
    const packet = new net.Packet.Parser(Buffer.from([0x1, 0x2, 0x3]));
    const fields = ['test1', 'test2', 'test3'];
    const res = packet.byte().byte().byte().collect(fields);
    assert.strictEqual(res.test1, 1);
    assert.strictEqual(res['test2'], 2);
    assert.strictEqual(res['test3'], 3);
  });
});
describe('@titan/net.Packet.Writer', function() {
  it('should write a byte, ubyte', function() {
    const packet = new net.Packet.Writer(2);
    const buf = packet.byte(2).ubyte(1).buffer();
    assert.strictEqual(buf.compare(Buffer.from([0x2, 0x1])), 0);
  });
  it('should write a short, ushort', function() {
    const packet = new net.Packet.Writer(4);
    const buf = packet.short(255).ushort(255).buffer();
    assert.strictEqual(buf.compare(Buffer.from([0xff, 0, 0xff, 0])), 0);
  });
  it('should write an int, uint', function() {
    const packet = new net.Packet.Writer(8);
    const buf = packet.int(-2147483648).uint(2147483647).buffer();
    const answer = Buffer.from([0, 0, 0, 0x80, 0xff, 0xff, 0xff, 0x7f]);
    assert.strictEqual(buf.compare(answer), 0);
  });
  it('should write a long, ulong', function() {
    const packet = new net.Packet.Writer(16);
    const buf = packet.long(BigInt(2)).ulong(BigInt(2)).buffer();
    const answer = Buffer.from([
      0x2, 0, 0, 0, 0, 0, 0, 0,
      0x2, 0, 0, 0, 0, 0, 0, 0
    ]);
    assert.strictEqual(buf.compare(answer), 0);
  });
});
const op = (num) => {
  const left = (num >> 8) & 0xff;
  const right = (num << 8) & 0xff00;
  return left | right;
}
const version = 83;
const cast = net.Packet.cast;
describe('@titan/net.Packet.cast', function() {
  it('should perform op to get header mask', function() {
    number = version;
    assert.strictEqual(op(number), 21248);
  });
  it('should cast uint8 then perform op to get header mask', function() {
    let number = version;
    const uint8 = cast(number).uint8();
    assert.strictEqual(op(uint8), 21248);
  });
  it('should cast int8 then perform op to get header mask', function() {
    let number = version;
    const int8 = cast(number).int8();
    assert.strictEqual(op(int8), 21248);
  });
  it('should cast int16 then perform op to get header mask', function() {
    let number = version;
    const int16 = cast(number).int16();
    assert.strictEqual(op(int16), 21248);
  });
  it('should cast uint16 then perform op to get header mask', function() {
    let number = version;
    const uint16 = cast(number).uint16();
    assert.strictEqual(op(uint16), 21248);
  });
  it('should cast int32 then perform op to get header mask', function() {
    let number = version;
    const int32 = cast(number).int32();
    assert.strictEqual(op(int32), 21248);
  });
  it('should cast float32 then perform op to get header mask', function() {
    let number = version;
    const float32 = cast(number).float32();
    assert.strictEqual(op(float32), 21248);
  });
});
describe('@titan/net.Packet.encode', () => {
  it('should encode a packet', function() {
    const iv = Buffer.from([0x1, 0x2, 0x3, 0x4]);
    let packet = new net.Packet.Writer(1);
    packet = packet.byte(0).buffer();
    const aes = new crypto.AES(iv, 83);
    const result = net.Packet.encode(packet, aes);
    const expected = Buffer.from([0x50, 0x04, 0x51, 0x04, 0x06]);
    assert.strictEqual(result.compare(expected), 0);
  });
});