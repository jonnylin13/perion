
const {Parser} = require('./packet/parser.js');
const {Writer} = require('./packet/writer.js');
/**
 * Exports the packet parser and writer
 * @module @titan/net
 */
module.exports = {Packet: {Parser, Writer}};
