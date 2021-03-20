const assert = require('assert');
const titan = require('../index.js');
describe('@titan/titan module exports', function() {
  it('should make Crypto package available', function() {
    assert.strictEqual('Crypto' in titan, true);
  });
  it('should make Crypto.AES package available', function() {
    assert.strictEqual('AES' in titan.Crypto, true);
  });
  it('should make Crypto.Shanda package available', function() {
    assert.strictEqual('Shanda' in titan.Crypto, true);
  });
});