const net = require('net');
const Encoder = require('./encoder.js');
const crypto = require('@perion/crypto');
const events = require('events');
let ids = 0;
class Server extends events.EventEmitter {
  constructor({host, port}, listen=false) {
    super();
    this.host = host;
    this.port = port;
    this.extSockets = [];
    this.minSocketId = Number.MAX_SAFE_INTEGER;
    this.instance = new net.Server();
    this.instance.on('connection', (socket) => this.onConnection(socket));
    this.instance.on('error', (err) => this.onError(err));
    if (listen) this.listen({host, port});
  }
  listen() {
    return new Promise((resolve, reject) => {
      try {
        this.instance.listen({port: this.port, host: this.host}, () => {
          // console.log(`Listening on ${host}:${port}`);
          this.emit('ready');
          resolve(true);
        });
      } catch (err) {
        reject(err);
        this.emit('error', err);
      }
    });
  }
  onConnection(socket) {
    // console.log('Server not implemented');
    if (ids == Number.MAX_SAFE_INTEGER) ids = 0;
    socket.id = ids++;
    if (this.minSocketId > socket.id) this.minSocketId = socket.id;
    socket.setKeepAlive(true);
    // Set encoder
    const send = new crypto.AES(
      Buffer.from([0x01, Math.round(Math.random() * 255), 0x03, 0x04]), 
      83
    );
    const recv = new crypto.AES(
      Buffer.from([0x01, Math.round(Math.random() * 255), 0x03, 0x04]),
      83
    );
    socket.encoder = new Encoder({aes: send, shanda: crypto.Shanda});
    socket.decoder = new Encoder({aes: recv, shanda: crypto.Shanda});
    socket.encWrite = (data) => {
      socket.write(socket.encoder.encode(data));
    };
    socket.on('data', (data) => this.onData({socket, data}));
    socket.on('error', (err) => this.onError(err, socket.id));
    socket.on('close', () => this.removeSocket(socket.id));
    this.extSockets.push(socket);
    this.emit('connection', socket);
  }
  removeSocket(socketId) {
    this.extSockets = this.extSockets.filter(socket => socket.id !== socketId);
  }
  getSocket(socketId) {
    const range = ids - this.minSocketId;
    const diff = socketId - this.minSocketId;
    const length = this.extSockets.length;
    const startValue = Math.round((diff/range) * (length));
    for (let i = 0; i < length / 2; i++) {
      if (this.extSockets[startValue+i] 
        && this.extSockets[startValue+i].id === socketId) {
        return this.extSockets[startValue+i];
      }
      if (this.extSockets[startValue-i] 
        && this.extSockets[startValue-i].id === socketId) {
        return this.extSockets[startValue-i];
      }
    }
    return null;
  }
  onError(err, socketId) {
    if (socketId === undefined) {
      // console.log('Error: ', err);
      this.emit('error', err);
      return;
    }
    // console.log('Error: ', err);
    this.emit('socket_error', err);
    if (socketId) this.removeSocket(socketId);
  }
  onData({socket, data}) {
    const packet = socket.decoder.decode(data);
    // TODO: Should we be sending the packet
    this.emit('packet', {socket, packet});
  }
  broadcast({data, ids}) {
    return new Promise((resolve) => {
      if (!ids || ids.length === 0) {
        for (const socket of this.extSockets) {
          socket.encWrite(data);
        }
        resolve(true);
        return;
      }
      for (const socketId of ids) {
        const socket = this.getSocket(socketId);
        if (!socket) continue;
        socket.encWrite(data);
      }
      resolve(true);
      return;
    });
  }
  destroy() {
    return new Promise((resolve, reject) => {
      this.instance.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        this.emit('destroy');
        resolve(true);
      });
    });
  }
}
module.exports = Server;