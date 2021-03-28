const assert = require('assert');
const BaseHandler = require('../src/base/baseHandler.js');
describe('@perion/net.BaseHandler', function() {
  it('should throw error on constructor', function() {
    try {
      const baseHandler = new BaseHandler();
    } catch (err) {
      assert(err !== null && err !== undefined);
    }
  });
  it('should check opcode then throw error on handle', function() {
    try {
      const baseHandler = new BaseHandler(0x01);
      assert(baseHandler.opcode === 0x01);
      baseHandler.handle({socket: {}, packet: {}});
    } catch (err) {
      assert(err.message.includes('Nope'));
    }
  });
});