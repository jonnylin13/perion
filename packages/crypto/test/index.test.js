const assert = require('assert');
const crypto = require('../index.js');
describe('@perion/crypto module exports', function() {
  it('should export crypto.AES', function() {
    assert.strictEqual('AES' in crypto, true);
  });
  it('should export crypto.Shanda', function() {
    assert.strictEqual('Shanda' in crypto, true);
  });
});