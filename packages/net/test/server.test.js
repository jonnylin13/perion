const Server = require('../src/server.js');
const Delegator = require('../src/delegator.js');
const assert = require('assert');
const Protocol = require('../src/protocol/protocol.js');
const crypto = require('@perion/crypto');
const Encoder = require('../src/encoder.js');
const server = new Server({host: 'localhost', port: 3000});
describe('@perion.net.Server', function() {
  it('should call onData', function() {
    const proto = new Protocol(['internal.proto.json']);
    const delegator = new Delegator('/handlers/', proto); 
    server.events.once('packet', ({socket, packet}) => {
      const result = delegator.delegate({socket, packet});
      console.log(result);
      console.log(packet);
      server.destroy().then(res => {
        assert(res);
      });
    });

    const socket = {};
    const aes = new crypto.AES(
      Buffer.from([0x01, Math.random() * 255, 0x03, 0x04]), 
      83
    );
    socket.encoder = new Encoder({aes, shanda: crypto.Shanda});
    socket.encWrite = (data) => {
      return true;
    };
    console.log(0x400);

    // Need to find a way to decrypt the AES
    // What does the client do?
    
    server.onData({
      data: Buffer.from([
        0, 0, 0, 0, 0x04, 0x00
      ]), 
      socket
    });
    
  });
});