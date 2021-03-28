
const Parser = require('./src/parser.js');
const Writer = require('./src/writer.js');
const Encoder = require('./src/encoder.js');
const BaseHandler = require('./src/base/baseHandler.js');
const Delegator = require('./src/delegator.js');
const Protocol = require('./src/protocol/protocol.js');
/**
 * A module that exports MapleStory related packet functions
 * @module @perion/net
 */
module.exports = {
  Packet: {
    Parser, Writer, Encoder, BaseHandler,
    Delegator, Protocol
  }
};
