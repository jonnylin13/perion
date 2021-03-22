
const {Parser} = require('./src/parser.js');
const {Writer} = require('./src/writer.js');
const Encoder = require('./src/encoder');
/**
 * A module that exports the packet parser, writer, and encode/decode functions
 * @module @perion/net
 */
module.exports = {Packet: {Parser, Writer, Encoder}};
