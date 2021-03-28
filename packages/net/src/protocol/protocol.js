const Writer = require('../writer.js');
const Params = require('../protocol/params.js');
class Protocol {
  constructor(protoPaths) {
    this.protocols = {};
    this.available = [];
    for (const path of protoPaths) {
      try {
        const protocol = require(__dirname + '/' + path);
        this.available.push(protocol.name);
        this.protocols[protocol.name] = protocol.messages;
      } catch (err) {
        throw new Error(`Could not load protocol file: ${path}`);
      }
    }
  }
  static _parseKey(protocolKey) {
    const split = protocolKey.split('.');
    const protoName = split[0];
    const msgName = split[1];
    return {protoName, msgName};
  }
  findSchema(protoName, opcode) {
    const protocol = this.protocols[protoName];
    for (const msg of Object.values(protocol)) {
      if (opcode === Number(msg.opcode)) return msg.schema;
    }
    return null;
  }
  schema(protocolKey) {
    const {protoName, msgName} = Protocol._parseKey(protocolKey);
    const protocol = this.protocols[protoName];
    const message = protocol[msgName];
    if (!(msgName in protocol)) {
      throw new Error(`Unknown message name ${protocolKey}`);
    }
    if (!('schema' in message)) {
      throw new Error(`Missing schema ${protocolKey}.schema`);
    }
    return message.schema;
  }
  eval(schema, parser) {
    for (const typeStr of schema) {
      const type = typeStr.split('?')[0];
      const params = Params.parse(typeStr);
      if (Object.keys(params).length === 0) {
        parser[type]();
      } else parser[type](params);
    }
  }
  build(protocolKey, values) {
    const {protoName, msgName} = Protocol._parseKey(protocolKey);
    const protocol = this.protocols[protoName];
    // TODO: Check for protocol.messages
    if (!protocol) {
      throw new Error(
        `Tried to build from unknown protocol ${protoName}.${msgName}`
      );
    }
    let length = 0;
    const message = protocol[msgName];
    if (!(msgName in protocol)) {
      throw new Error(`Unknown message name ${protocolKey}`);
    }
    const schema = message.schema;
    const opcode = message.opcode;
    if (!('schema' in message)) {
      throw new Error(`Missing schema ${protocolKey}.schema`);
    }
    if(!('opcode' in message)) {
      throw new Error(`Missing opcode ${protocolKey}.opcode`);
    }
    if (message.schema.length !== values.length) {
      throw new Error('Message schema not matching input values');
    }
    // Calculate packet length
    for (const idx in schema) {
      const type = schema[idx].split('?')[0];
      const params = Params.parse(schema[idx]);
      switch (type) {
        case 'byte':
        case 'ubyte':
        case 'bool':
          length += 1;
          break;
        case 'short':
        case 'ushort':
          length += 2;
          break;
        case 'int':
        case 'uint':
        case 'pos':
          length += 4;
          break;
        case 'long':
        case 'ulong':
          length += 8;
          break;
        case 'ascii':
          length += Number(params.length);
          break;
        case 'nullascii':
          length += values[idx].length + 1;
          break;
        case 'mapleascii':
          length += values[idx].length + 2;
          break;
        default:
          throw new Error(`Unknown datatype ${type}`);
      }
    }
    const writer = new Writer(2 + length);
    writer.short(Number(opcode));
    // Map the schema to values
    for (const idx in schema) {
      const type = schema[idx].split('?')[0];
      const params = Params.parse(type);
      if (Object.keys(params).length === 0) {
        writer[type](values[idx]);
      }
    }
    return writer.buffer();
  }
}
module.exports = Protocol;