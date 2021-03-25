class BaseHandler {
  constructor(opcode) {
    if (!opcode) throw new Error('Must provide opcode in BaseHandler');
    this.opcode = opcode;
  }
  handle({socket, packet}, protocol) {
    throw new Error('Nope');
  }
}
module.exports = BaseHandler;