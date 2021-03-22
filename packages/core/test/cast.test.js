const assert = require('assert');
const cast = require('../index.js').cast;
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