class Delegator {
  constructor() {
    this.handlers = {};
  }
  getHandler(opcode) {
    return this.handlers[opcode];
  }
} /** TODO: Implement this. Switch to TS? */