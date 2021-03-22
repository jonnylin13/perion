const net = require('net');

const server = new net.createServer((socket) => {
  
  socket.on('data', (buffer) => {
    console.log(buffer);
  });
  socket.on('close', () => {

  });
});

server.listen(8484, () => {
  console.log('Server listening on 8484');
});