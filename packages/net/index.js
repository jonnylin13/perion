
const {Parser} = require('./src/parser.js');
const {Writer} = require('./src/writer.js');
const {encode, decode} = require('./src/encoder');
/**
 * Exports the packet parser and writer, cast
 * @module @perion/net
 */
module.exports = {Packet: {Parser, Writer, encode, decode}};
