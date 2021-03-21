const assert = require('assert');
const crypto = require('../index.js');
describe('@titan/crypto.Shanda', function() {
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
});