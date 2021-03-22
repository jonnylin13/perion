
const {Parser} = require('./src/parser.js');
const {Writer} = require('./src/writer.js');
const {cast} = require('./src/cast.js');
const {encode, decode} = require('./src/encoder');
/**
 * Exports the packet parser and writer, cast
 * @module @titan/net
 */
module.exports = {Packet: {Parser, Writer, cast, encode, decode}};
