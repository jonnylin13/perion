const BaseHandler = require('../base/baseHandler.js');
class PingHandler extends BaseHandler {
  constructor() {
    super(0x400);
  }
  handle({socket}, protocol) {
    const response = protocol.build('internal.pong', []);
    socket.encWrite(response);
    return true;
  }
}
module.exports = PingHandler;