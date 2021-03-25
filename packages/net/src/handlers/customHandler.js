const BaseHandler = require('../base/baseHandler.js');
const Parser = require('../parser.js');
class CustomHandler extends BaseHandler {
  constructor() {
    super(0x402);
  }
  handle({packet, socket}, protocol) {
    const parser = Parser.from(packet.data.slice(2));
    try {
      const schema = protocol.findSchema('internal', packet.opcode);
      protocol.eval(schema, parser);
      return (parser.collect([
        'byte', 
        'short', 
        'int', 
        'long', 
        'ascii', 
        'nullascii', 
        'mapleascii'
      ]));
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = CustomHandler;