const assert = require('assert');
const crypto = require('../index.js');
describe('@perion/crypto.Shanda', function() {
  it('should rotate a byte left', function() {
    const r1 = crypto.Shanda.Util.rol(12, 1);
    const r2 = crypto.Shanda.Util.rol(9, 9);
    assert.strictEqual(r1, 24);
    assert.strictEqual(r2, 18);
  });
  it('should rotate a byte right', function() {
    const r1 = crypto.Shanda.Util.ror(24, 1);
    const r2 = crypto.Shanda.Util.ror(254, 9);
    assert.strictEqual(r1, 12);
    assert.strictEqual(r2, 127);
  });
  it('should encrypt and decrypt a payload', function() {
    const payload = Buffer.from([0x1, 0x1, 0x1, 0x1]);
    const encrypted = crypto.Shanda.encrypt(payload);
    assert.ok(encrypted.compare(Buffer.from([0xe3, 0x12, 0x62, 0x51])) === 0);
    const decrypted = crypto.Shanda.decrypt(encrypted);
    assert.deepEqual(decrypted, Buffer.from([0x1, 0x1, 0x1, 0x1]));
  });
});