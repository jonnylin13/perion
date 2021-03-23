const assert = require('assert');
const Cast = require('../index.js').Cast;
const op = (num) => {
  const left = (num >> 8) & 0xff;
  const right = (num << 8) & 0xff00;
  return left | right;
}
const version = 83;
describe('@perion/net.Packet.cast', function() {
  it('should perform op to get header mask', function() {
    number = version;
    assert.strictEqual(op(number), 21248);
  });
  it('should cast uint8 then perform op to get header mask', function() {
    let number = version;
    const uint8 = Cast.from(number).uint8();
    assert.strictEqual(op(uint8), 21248);
  });
  it('should cast int8 then perform op to get header mask', function() {
    let number = version;
    const int8 = Cast.from(number).int8();
    assert.strictEqual(op(int8), 21248);
  });
  it('should cast int16 then perform op to get header mask', function() {
    let number = version;
    const int16 = Cast.from(number).int16();
    assert.strictEqual(op(int16), 21248);
  });
  it('should cast short then perform op to get header mask', function() {
    let number = version;
    const int16 = Cast.from(number).short();
    assert.strictEqual(op(int16), 21248);
  });
  it('should cast uint16 then perform op to get header mask', function() {
    let number = version;
    const uint16 = Cast.from(number).uint16();
    assert.strictEqual(op(uint16), 21248);
  });
  it('should cast ushort then perform op to get header mask', function() {
    let number = version;
    const int16 = Cast.from(number).ushort();
    assert.strictEqual(op(int16), 21248);
  });
  it('should cast int32 then perform op to get header mask', function() {
    let number = version;
    const int32 = Cast.from(number).int32();
    assert.strictEqual(op(int32), 21248);
  });
  it('should cast uint32 then perform op to get header mask', function() {
    let number = version;
    const uint32 = Cast.from(number).uint32();
    assert.strictEqual(op(uint32), 21248);
  });
  it('should cast int64', function() {
    let number = version;
    const int64 = Cast.from(number).int64();
    assert.ok(typeof int64 == 'bigint');
  });
  it('should cast float32 then perform op to get header mask', function() {
    let number = version;
    const float32 = Cast.from(number).float32();
    assert.strictEqual(op(float32), 21248);
  });
  it('should cast float64 then perform op to get header mask', function() {
    let number = version;
    const float64 = Cast.from(number).float64();
    assert.strictEqual(op(float64), 21248);
  });
});