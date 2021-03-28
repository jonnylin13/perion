const Server = require('../src/server.js');
const Delegator = require('../src/delegator.js');
const assert = require('assert');
const Protocol = require('../src/protocol/protocol.js');
const crypto = require('@perion/crypto');
const Encoder = require('../src/encoder.js');
const net = require('../index.js');
const {createConnection} = require('net');
describe('@perion.net.Server', function() {
  it('should call onData', function(done) {
    const server = new Server({host: 'localhost', port: 3000});
    server.listen();

    server.once('ready', () => {
      const proto = new Protocol(['internal.proto.json']);
      const delegator = new Delegator('/handlers/', proto); 
      server.once('packet', ({socket, packet}) => {
        const result = delegator.delegate({socket, packet});
        assert(result);
        server.destroy().then(res => {
          assert(res);
          done();
        });
      });

      const socket = {};
      const send = new crypto.AES(
        Buffer.from([0x01, 0x02, 0x03, 0x04]), 
        83
      );
      const recv = new crypto.AES(
        Buffer.from([0x01, 0x02, 0x03, 0x04]), 
        83
      );
      socket.encoder = new Encoder({aes: send, shanda: crypto.Shanda});
      const data = socket.encoder.encode(Buffer.from([0x00, 0x04]));
      socket.decoder = new Encoder({aes: recv, shanda: crypto.Shanda});
      socket.encWrite = (data) => {
        assert(data.compare(Buffer.from([0x00, 0x04])));
      };
      server.onData({
        data,
        socket
      });
    });
    
  });
  it('should throw error on destroy', function(done) {
    const server = new Server([{host: 'localhost', port: 3000}], true);
    server.once('ready', () => {
      server.destroy().then(res => {
        assert(res);
        server.destroy().then(res => {
        }).catch(err => {
          assert(err.code === 'ERR_SERVER_NOT_RUNNING');
          done();
        })
      });
    });
  });
  it('should test on connection and fetch the socket', function(done) {
    const server = new Server([{host: 'localhost', port: 3000}]);
    server.listen();
    let socket = {setKeepAlive: () => {}, on: () => {}};
    server.once('connection', (compare) => {
      assert.deepEqual(socket, compare);
      assert(server.getSocket(0).id === 0);
      server.destroy();
    });
    server.once('destroy', () => {
      done();
    });
    server.once('ready', () => {
      server.onConnection(socket);
    });
  });
  it('should test multiple connections and fetch the socket', function(done) {
    const server = new Server({host: 'localhost', port: 3000});
    const sockets = [];
    const socket = {setKeepAlive: () => {}, on: () => {}};
    for (let i = 0; i < 100; i++) {
      sockets.push(Object.assign(socket));
    }
    let count = 0;
    server.on('connection', (compare) => {
      const sock = server.getSocket(compare.id);
      assert(sock.id === compare.id);
      count++;
      if (count === 100) {
        server.destroy();
      }
    });
    server.once('destroy', () => {
      done();
    });
    server.listen();
    server.once('ready', () => {
      for (const sock of sockets) {
        server.onConnection(sock);
      }
    });
  });
  it('should test multiple connections, broadcast, remove', function(done) {
    const server = new Server({host: 'localhost', port: 3000});
    const sockets = [];
    const socket = {setKeepAlive: () => {}, on: () => {}, write: () => {}};
    for (let i = 0; i < 100; i++) {
      sockets.push(Object.assign(socket));
    }
    let count = 0;
    server.on('connection', (compare) => {
      compare.encWrite(Buffer.from([0x00, 0x00, 0x00, 0x00]));
      server.broadcast({data: Buffer.from([
        0x00, 0x00, 0x00, 0x00
      ])}).then(res => {
        assert(res);
      });
      count++;
      if (count === 100) server.destroy();
    });
    server.once('destroy', () => {
      done();
    });
    server.listen();
    server.once('ready', () => {
      for (const sock of sockets) {
        server.onConnection(sock);
      }
      server.broadcast({data: Buffer.from([
        0x00
      ]), ids: [1, 2, 3]});
    });
  });
  it('should connect an actual socket', function(done) {
    const server = new Server({host: 'localhost', port: 3000});
    server.listen();
    let socket;
    server.once('connection', (socket) => {
      assert(socket.id === 201);
      socket.destroy();
      socket = null;
      server.destroy();
    });
    server.once('ready', () => {
      socket = createConnection({host: 'localhost', port: 3000});
    });
    server.once('destroy', () => {
      done();
    });
  });
  it('should force a server error', function(done) {
    const server1 = new Server({host: 'localhost', port: 3000});
    const server2 = new Server({host: 'localhost', port: 3000});
    server1.once('error', (err) => {
      console.log(err);
      assert(false);
    });
    server2.once('error', (err) => {
      assert(err.code === 'EADDRINUSE');
      server1.destroy();
      done();
    });
    server1.listen().finally(() => {
      server2.listen().catch(err => {
        assert(err.code === 'EADDRINUSE');
        server2.destroy();
      });
    });
  });
});