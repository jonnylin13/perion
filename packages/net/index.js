
const {Parser} = require('./src/parser.js');
const {Writer} = require('./src/writer.js');
const {encode, decode} = require('./src/encoder');
/**
 * Exports the packet parser, writer, and encode/decode functions
 * @module @perion/net
 */
module.exports = {Packet: {Parser, Writer, encode, decode}};
