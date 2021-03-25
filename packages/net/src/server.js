const net = require('net');
const Encoder = require('./encoder.js');
const crypto = require('@perion/crypto');
const events = require('events');
let ids = 0;
class Server {
  constructor({host, port}) {
    this.extSockets = [];
    this.minSocketId = null;
    this.maxSocketId = null;
    this.events = new events.EventEmitter();
    this.instance = new net.Server();
    this.instance.on('connection', (socket) => this.onConnection(socket));
    this.instance.on('error', (err) => this.onError(err));
    this.instance.listen({port, host}, () => {
      // console.log(`Listening on ${host}:${port}`);
      this.events.emit('ready');
    });
  }
  onConnection(socket) {
    // console.log('Server not implemented');
    socket.id = ids++;
    socket.setKeepAlive(true);
    // Set encoder
    const aes = new crypto.AES(
      Buffer.from([0x01, Math.random() * 255, 0x03, 0x04]), 
      83
    );
    socket.encoder = new Encoder({aes, shanda: crypto.Shanda});
    socket.encWrite = (data) => {
      socket.write(socket.encoder.encode(data));
    };
    if (this.minSocketId === null) this.minSocketId = socket.id;
    if (this.maxSocketId === null) this.maxSocketId = socket.id;
    if (ids == Number.MAX_SAFE_INTEGER) ids = 0;
    socket.on('data', (data) => this.onData({socket, data}));
    socket.on('error', (err) => this.onError(err, socket.id));
    socket.on('close', () => this.removeSocket(socket.id));
    this.extSockets.push(socket);
  }
  removeSocket(socketId) {
    this.extSockets = this.extSockets.filter(socket => socket.id !== socketId);
  }
  getSocket(socketId) {
    const range = this.maxSocketId - this.minSocketId;
    const diff = socketId - this.minSocketId;
    const length = this.extSockets.length;
    const startValue = Math.round((diff/range) * (length));
    for (let i = 0; i < length / 2; i++) {
      if (this.extSockets[startValue+i] 
        && this.extSockets[startValue+i].id === socketId) {
        return this.sockets[startValue+i];
      }
      if (this.extSockets[startValue-i] 
        && this.extSockets[startValue-i].id === socketId) {
        return this.sockets[startValue-i];
      }
    }
    return null;
  }
  onError(err, socketId) {
    console.log('err: ', err);
    if (socketId) this.removeSocket(socketId);
  }
  onData({socket, data}) {
    const packet = socket.encoder.decode(data);
    // TODO: Should we be sending the packet
    this.events.emit('packet', {socket, packet});
  }
  emit({data, ids}) {
    return new Promise((resolve) => {
      if (ids.length === 0) {
        for (const socket of this.extSockets) {
          socket.encWrite(data);
        }
        resolve();
        return;
      }
      for (const socketId of ids) {
        const socket = this.getSocket(socketId);
        if (!socket) continue;
        socket.encWrite(data);
      }
      resolve();
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
        resolve(true);
      });
    });
  }
}
module.exports = Server;