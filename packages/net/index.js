
const {Parser} = require('./packet/parser.js');
const {Writer} = require('./packet/writer.js');
const {cast} = require('./packet/cast.js');
/**
 * Exports the packet parser and writer, cast
 * @module @titan/net
 */
module.exports = {Packet: {Parser, Writer, cast}};
