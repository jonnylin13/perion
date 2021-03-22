const assert = require('assert');
const perion = require('../index.js');
describe('@perion/titan module exports', function() {
  it('should export crypto', function() {
    assert.strictEqual('crypto' in perion, true);
  });
  it('should export crypto.AES', function() {
    assert.strictEqual('AES' in perion.crypto, true);
  });
  it('should export crypto.Shanda', function() {
    assert.strictEqual('Shanda' in perion.crypto, true);
  });
  it('should export net.Packet', function() {
    assert.strictEqual('Packet' in perion.net, true);
  });
  it('should export net.Packet.Parser', function() {
    assert.strictEqual('Parser' in perion.net.Packet, true);
  });
  it('should export net.Packet.Writer', function() {
    assert.strictEqual('Writer' in perion.net.Packet, true);
  });
});