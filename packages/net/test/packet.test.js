const assert = require('assert');
const net = require('../index.js');
const crypto = require('@perion/crypto');
const Parser = net.Packet.Parser;

describe('@perion/net.Packet.Parser', function() {
  it('should read a byte, ubyte', function() {
    const packet = Parser.from(Buffer.from([0x2, 0x2]));
    const data = packet.byte().ubyte().collect(['val1', 'val2']);
    assert.strictEqual(data.val1, 0x2);
    assert.strictEqual(data.val2, 0x2);
  });
  it('should read a few bytes and collect', function() {
    const packet = Parser.from(Buffer.from([0x1, 0x2, 0x3]));
    const fields = ['test1', 'test2', 'test3'];
    const res = packet.byte().byte().byte().collect(fields);
    assert.strictEqual(res.test1, 1);
    assert.strictEqual(res['test2'], 2);
    assert.strictEqual(res['test3'], 3);
  });
  it('should read a bool', function() {
    const packet = Buffer.from([0x00]);
    const packet2 = Buffer.from([0x01]);
    const parser = Parser.from(packet);
    const parser2 = Parser.from(packet2);
    assert.ok(!parser.bool().get());
    assert.ok(parser2.bool().get());
  });
  it('should read a char', function() {
    const packet = Buffer.from([0x01, 0x00]);
    const parser = Parser.from(packet);
    assert.ok(parser.char().get() === 'b');
  });
  it('should read a double', function() {
    const packet = Buffer.from([
      0x2, 0, 0, 0, 0, 0, 0, 0
    ]);
    const parser = Parser.from(packet);
    assert.ok(parser.double().get() == '1e-323');
  });
  it('should read a short, ushort', function() {
    const packet = Buffer.from([0xff, 0,  0xff, 0]);
    const parser = Parser.from(packet);
    const result = parser.short().ushort().collect([0, 1]);
    assert.strictEqual(result[0], 255);
    assert.strictEqual(result[1], 255);
  });
  it('should read an int, uint', function() {
    const packet = Buffer.from([0, 0, 0, 0x80, 0xff, 0xff, 0xff, 0x7f]);
    const parser = Parser.from(packet);
    const result = parser.int().uint().collect([0, 1]);
    assert.strictEqual(-2147483648, result[0]);
    assert.strictEqual(2147483647, result[1]);
  });
  it('should read a long, ulong', function() {
    const packet = Buffer.from([
      0x2, 0, 0, 0, 0, 0, 0, 0,
      0x2, 0, 0, 0, 0, 0, 0, 0
    ]);
    const parser = Parser.from(packet);
    const result = parser.long().ulong().collect(['x', 'y']);
    assert.strictEqual(result.x, result.y);
    assert.strictEqual(result.x, BigInt(2));
  });
  it('should read an ascii string', function() {
    const packet = Buffer.from([
      0x74, 0x65, 0x73, 0x74
    ]);
    const parser = Parser.from(packet);
    const result = parser.ascii({length: 4}).get();
    assert.strictEqual(result, 'test');
  });
  it('should read a null ascii string', function() {
    const packet = Buffer.from([
      0x74, 0x65, 0x73, 0x74, 0x00
    ]);
    const result = Parser.from(packet).nullascii().get();
    assert.strictEqual(result, 'test');
  });
  it('should read a maple ascii string', function() {
    const packet = Buffer.from([
      0x04, 0x00, 0x74, 0x65, 0x73, 0x74
    ]);
    const result = Parser.from(packet).mapleascii().get();
    assert.strictEqual(result, 'test');
  });
  it('should read a pos', function() {
    const packet = Buffer.from([
      0x01, 0x00, 0x00, 0x00
    ]);
    const result = Parser.from(packet).pos().get();
    assert.deepEqual(result, {x: 1, y: 0});
  });
  it('should skip 2 bytes and read bytes', function() {
    const packet = Buffer.from([0x00, 0x00, 0x1, 0x00]);
    const result = Parser.from(packet).skip(2).read(1).get();
    assert.deepEqual(result, Buffer.from([1]));
  });
  it('should seek the cursor', function() {
    const packet = Buffer.from([0x01, 0x00, 0x02, 0x00]);
    const result = Parser.from(packet).skip(1).seek(0).byte().get();
    assert.strictEqual(result, 1);
  });
  it('should test collect length validation', function() {
    const packet = Buffer.from([0x01, 0x02]);
    const collected = Parser.from(packet).byte().byte().collect(
      ['flag1', 'flag2', 'flag3']
    );
    assert.ok(!collected);
  });
  it('should test removeParsed flag for get', function() {
    const packet = Buffer.from([0x01]);
    const parse = Parser.from(packet);
    const result = parse.byte().get(false);
    const collect = parse.collect(['test']);
    assert.strictEqual(result, collect.test);
  });
});
describe('@perion/net.Packet.Writer', function() {
  it('should write a byte, ubyte', function() {
    const packet = new net.Packet.Writer(2);
    const buf = packet.byte(2).ubyte(1).buffer();
    assert.strictEqual(buf.compare(Buffer.from([0x2, 0x1])), 0);
  });
  it('should write a bool', function() {
    const packet = new net.Packet.Writer(2);
    const buf = packet.bool(0).bool(1).buffer();
    assert.strictEqual(buf.compare(Buffer.from([0x00, 0x01])), 0);
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
  it('should write an ascii string', function() {
    const packet = new net.Packet.Writer(4);
    packet.ascii('test');
    const answer = Buffer.from([
      0x74, 0x65, 0x73, 0x74
    ]);
    assert.deepEqual(answer, packet.buffer());
  });
  it('should write a null terminated string', function() {
    const packet = new net.Packet.Writer(5);
    packet.nullascii('test');
    const answer = Buffer.from([
      0x74, 0x65, 0x73, 0x74, 0x00
    ]);
    assert.deepEqual(answer, packet.buffer());
  });
  it('should write a maple ascii string', function() {
    const packet = new net.Packet.Writer(6);
    packet.mapleascii('test');
    const answer = Buffer.from([
      0x04, 0x00, // Length
      0x74, 0x65, 0x73, 0x74 // String
    ]);
    assert.deepEqual(answer, packet.buffer());
  });
  it('should write a pos', function() {
    const packet = new net.Packet.Writer(4);
    packet.pos({x: 1, y: 0});
    const answer = Buffer.from([
      0x01, 0x00, 0x00, 0x00
    ]);
    assert.deepEqual(answer, packet.buffer());
  });
  it('should test dynamic allocation', function() {
    const packet = new net.Packet.Writer(1);
    packet.mapleascii('test');
    assert.ok(packet.buffer().byteLength == 6);
  });
});
describe('@perion/net.Packet.encode', () => {
  it('should encode and decode a packet', function() {
    const iv = Buffer.from([0x1, 0x2, 0x3, 0x4]);
    let packet = new net.Packet.Writer(2);
    packet = packet.byte(0).byte(0).buffer();
    const aes = new crypto.AES(iv, 83);
    console.log(packet);
    const encoder = new net.Packet.Encoder({aes, shanda: crypto.Shanda});
    const encoded = encoder.encode(packet);
    console.log(encoded);
    assert.deepEqual(encoded, Buffer.from([
      0x50, 0x04, 0x52, 0x04, 0xf1, 0xde
    ]));
    const decoded = encoder.decode(encoded, false);
    console.log(decoded);
    assert.deepEqual(decoded.data, Buffer.from([0x0c, 0x1e]));
  });
});
