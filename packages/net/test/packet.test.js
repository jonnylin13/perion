const assert = require('assert');
const net = require('../index.js');
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