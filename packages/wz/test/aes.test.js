const assert = require('assert');
const {AES, rotl, rotr, calculateHash} = require('../src/crypto/aes.js');
describe('@perion/wz.AES', function() {
  it('should instantiate a WZAES object and expand xor key', function() {
    const aes = new AES('GMS');
    aes.provisionXorKey(16);
    assert.deepEqual(aes.xorKey, Buffer.from([
      0x96, 0xae, 0x3f, 0xa4, 0x48, 0xfa, 0xdd, 0x90, 
      0x46, 0x76, 0x05, 0x61, 0x97, 0xce, 0x78, 0x68
    ]));
    assert.deepEqual(aes.iv, aes.xorKey); // Just for this case
  });
  it('should test SEA IV and expand xor key', function() {
    const aes = new AES('SEA');
    aes.provisionXorKey(16);
    assert.deepEqual(aes.iv, Buffer.from([
      0xab, 0x65, 0x49, 0x05, 0x67, 0xcd, 0x57, 0x0a,
      0x98, 0x7b, 0x87, 0x0a, 0xec, 0x65, 0x07, 0x8b
    ]));
    assert.deepEqual(aes.iv, aes.xorKey);
  });
  it('should test default IV and expand xor key', function() {
    const aes = new AES('DEFAULT');
    aes.provisionXorKey(16);
    assert.deepEqual(aes.iv, Buffer.from([
      0xdd, 0x51, 0x36, 0xd7, 0x83, 0x18, 0x38, 0x72, 
      0xe7, 0x76, 0x41, 0x1e, 0xcc, 0xda, 0x1f, 0x6e
    ]));
    assert.deepEqual(aes.iv, aes.xorKey);
  });
  it('should expand xor key with length 18 and test provision', function() {
    const aes = new AES('GMS');
    aes.provisionXorKey(18);
    assert.deepEqual(aes.iv, Buffer.from([
      0x2b, 0xa0, 0x44, 0x8f, 0xc1, 0x56, 0x7e, 0x32, 
      0xfc, 0xe1, 0xf5, 0xb3, 0x14, 0x14, 0xc5, 0x22
    ]));
    assert.deepEqual(aes.xorKey, Buffer.from([
      0x96, 0xae, 0x3f, 0xa4, 0x48, 0xfa, 0xdd, 0x90,
      0x46, 0x76, 0x05, 0x61, 0x97, 0xce, 0x78, 0x68,
      0x2b, 0xa0, 0x44, 0x8f, 0xc1, 0x56, 0x7e, 0x32, 
      0xfc, 0xe1, 0xf5, 0xb3, 0x14, 0x14, 0xc5, 0x22
    ]));
    aes.provisionXorKey(16);
    assert(aes.xorKey.length === 32);
  });
  it('should test rotate left and rotate right', function() {
    assert(rotr(2, 1) === 1);
    assert(rotl(100, 1) === 200);
  });
  it('should test transform', function() {
    const aes = new AES('GMS');
    const data = Buffer.from([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
      0x08, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10
    ]);
    const answer = Buffer.from([
      0x96, 0xaf, 0x3d, 0xa7, 0x4c, 0xff, 0xdb, 0x97, 
      0x4e, 0x7c, 0x0e, 0x6d, 0x9a, 0xc0, 0x77, 0x78
    ]);
    const transformed = aes.transform(data);
    assert(answer.compare(transformed) === 0);
  });
  it('should calculate hash', function() {
    assert.deepEqual(calculateHash(83), {x: 172, y: 1876});
  });
  it('should check isEncrypted', function() {
    const aes = new AES('GMS');
    assert(aes.isEncrypted('test') == false);
  });
});