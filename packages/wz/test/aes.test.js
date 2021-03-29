const assert = require('assert');
const {AES, rotl, rotr, calculateHash} = require('../src/crypto/aes.js');
describe('@perion/wz.AES', function() {
  it('should instantiate a wz.AES object and generate xor keys', function() {
    const aes = new AES('GMS', 16);
    assert.deepEqual(aes._wzKey, Buffer.from([
      0x96, 0xae, 0x3f, 0xa4, 0x48, 0xfa, 0xdd, 0x90, 
      0x46, 0x76, 0x05, 0x61, 0x97, 0xce, 0x78, 0x68
    ]));
    assert.deepEqual(aes.iv, aes.xorKey); // Just for this case
  });
  it('should test SEA IV and generate xor keys', function() {
    const aes = new AES('SEA', 16);
    assert.deepEqual(aes._wzKey, Buffer.from([
      0xab, 0x65, 0x49, 0x05, 0x67, 0xcd, 0x57, 0x0a,
      0x98, 0x7b, 0x87, 0x0a, 0xec, 0x65, 0x07, 0x8b
    ]));
  });
  it('should test default IV and generate xor keys', function() {
    const aes = new AES('DEFAULT', 16);
    assert.deepEqual(aes._wzKey, Buffer.from([
      0xdd, 0x51, 0x36, 0xd7, 0x83, 0x18, 0x38, 0x72, 
      0xe7, 0x76, 0x41, 0x1e, 0xcc, 0xda, 0x1f, 0x6e
    ]));
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
    const transformed = aes.decrypt(data);
    assert(answer.compare(transformed) === 0);
  });
  it('should calculate hash', function() {
    assert.deepEqual(calculateHash(83), {version: 172, hash: 1876});
  });
});