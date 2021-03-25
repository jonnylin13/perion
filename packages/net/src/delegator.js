const fs = require('fs');
class Delegator {
  constructor(dir, protocol) {
    this.handlers = {};
    this.protocol = protocol;
    for (const file of fs.readdirSync(__dirname + dir)) {
      try {
        const Class = require(__dirname + dir + file);
        const baseHandler = new Class();
        this.handlers[baseHandler.opcode] = baseHandler;
      } catch (err) {
        throw err;
      }
    }
  }
  delegate({packet, socket}) {
    if (!(packet.opcode in this.handlers)) {
      // console.log(`Unhandled opcode ${packet.opcode}`);
      // throw new Error(`Unhandled opcode: ${opcode}`);
      return false;
    }
    return this.handlers[packet.opcode].handle({packet, socket}, this.protocol);
  }
}
module.exports = Delegator;