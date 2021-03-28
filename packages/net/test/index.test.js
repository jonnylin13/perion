const assert = require('assert');
const net = require('../index.js');
describe('@perion/net module exports', function() {
  it('should export net.Packet', function() {
    assert('Packet' in net);
  });
  it('should export net.Packet.Parser', function() {
    assert('Parser' in net.Packet);
  });
  it('should export net.Packet.Writer', function() {
    assert('Writer' in net.Packet);
  });
  it('should export net.Packet.Encoder', function() {
    assert('Encoder' in net.Packet);
  });
  it('should export net.Packet.BaseHandler', function() {
    assert('BaseHandler' in net.Packet);
  });
  it('should export net.Packet.Delegator', function() {
    assert('Delegator' in net.Packet);
  });
  it('should export net.Packet.Protocol', function() {
    assert('Protocol' in net.Packet);
  })
});