
const Parser = require('./src/parser.js');
const Writer = require('./src/writer.js');
const Encoder = require('./src/encoder');
/**
 * A module that exports MapleStory related packet functions
 * @module @perion/net
 */
module.exports = {Packet: {Parser, Writer, Encoder}};
