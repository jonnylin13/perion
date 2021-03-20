const assert = require('assert');
const titan = require('../index.js');
describe('@titan/titan module exports', function() {
  it('should make Crypto package available', function() {
    assert.strictEqual('Crypto' in titan, true);
  });
  it('should make Crypto.AES available', function() {
    assert.strictEqual('AES' in titan.Crypto, true);
  });
  it('should make Crypto.Shanda available', function() {
    assert.strictEqual('Shanda' in titan.Crypto, true);
  });
  it('should make Packet.Parser available', function() {
    assert.strictEqual('Parser' in titan.Packet, true);
  });
});