const assert = require('assert');
const net = require('../index.js');
describe('@titan/net module exports', function() {
  it('should export net.Packet', function() {
    assert.strictEqual('Packet' in net, true);
  });
  it('should export net.Packet.Parser', function() {
    assert.strictEqual('Parser' in net.Packet, true);
  });
  it('should export net.Packet.Writer', function() {
    assert.strictEqual('Writer' in net.Packet, true);
  });
});