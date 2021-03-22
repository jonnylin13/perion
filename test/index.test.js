const assert = require('assert');
const titan = require('../index.js');
describe('@perion/titan module exports', function() {
  it('should export crypto', function() {
    assert.strictEqual('crypto' in titan, true);
  });
  it('should export crypto.AES', function() {
    assert.strictEqual('AES' in titan.crypto, true);
  });
  it('should export crypto.Shanda', function() {
    assert.strictEqual('Shanda' in titan.crypto, true);
  });
  it('should export net.Packet', function() {
    assert.strictEqual('Packet' in titan.net, true);
  });
  it('should export net.Packet.Parser', function() {
    assert.strictEqual('Parser' in titan.net.Packet, true);
  });
  it('should export net.Packet.Writer', function() {
    assert.strictEqual('Writer' in titan.net.Packet, true);
  });
});