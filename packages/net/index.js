
const {Parser} = require('./packet/parser.js');
const {Writer} = require('./packet/writer.js');
const {cast} = require('./packet/cast.js');
const {encode, decode} = require('./packet/encoder');
/**
 * Exports the packet parser and writer, cast
 * @module @titan/net
 */
module.exports = {Packet: {Parser, Writer, cast, encode, decode}};
