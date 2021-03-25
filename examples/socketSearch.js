// Socket search algorithm

// Sockets are assigned an id ascending from 0
// That means at any given time, the list of sockets will be sorted by id
// For example, socket 0 connects, socket 1 connects, socket 2 connects ...
// If we always push sockets to the end of the list
// No combination of removing these sockets can create an unordered list
// Therefore, if we keep track of the first and last element id
// We can do a modified binary search based on the socket requested

// Linear transform: Y = (X-A)/(B-A) * (D-C) + C
const {performance} = require('perf_hooks');
const sockets = [];
function createSocket(id) {
  return {id};
}
let n = Number.MAX_SAFE_INTEGER;
let m = Number.MIN_SAFE_INTEGER;
let selected = null;
for (let i = 100; i < 1000000; i++) {
  if (Math.random() < 0.7) continue;
  sockets.push(createSocket(i));
  if (i < n) n = i;
  if (m < i) m = i;
  if (selected == null && Math.random() < 0.0001 && i > 400000) {
    selected = i;
  }
}
console.log('sockets: ', sockets);
console.log('length: ', sockets.length);
console.log('n: ', n);
console.log('m: ', m);
console.log('selected: ', selected);
const length = sockets.length;
function getSocket(socketId) {
  // map n to m
  //  -> 0 to length
  const startValue = Math.round(((socketId-n)/(m-n)) * (length));
  // console.log(startValue);
  let iterations = 0;

  for (let i = 0; i < length / 2; i++) {
    if (sockets[startValue + i]) {
      if (sockets[startValue + i].id === socketId) return iterations;
    }
    if (sockets[startValue - i]) {
      if (sockets[startValue - i].id === socketId) return iterations;
    }
    iterations++;
  }

  console.log('iterations: ', iterations);
  return null;
}
function naiveGetSocket(socketId) {
  let iterations = 0;
  for (const socket of sockets) {
    if (socketId === socket.id) return iterations;
    iterations++;
  }
  return null;
}
let t1 = performance.now();
console.log('iterations: ', getSocket(selected));
let t2 = performance.now();
console.log(`getSocket took ${t2-t1}`);

t1 = performance.now();
console.log('iterations: ', naiveGetSocket(selected));
t2 = performance.now();
console.log(`naiveGetSocket took ${t2-t1}`);
