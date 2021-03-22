class Delegator {
  constructor() {
    this.handlers = {};
  }
  getHandler(opcode) {
    return this.handlers[opcode];
  }
} /** Test */