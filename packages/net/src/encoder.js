const Parser = require('./parser.js');
/**
 * Provides encode and decode functions for MapleStory packets
 * @class
 * @memberof module:@perion/net
 */
class Encoder {
  constructor({shanda, aes}) {
    this.shanda = shanda;
    this.aes = aes;
  }
  /**
   * Encodes a packet using MapleStory encoding
   * @param {Buffer} data The output data buffer
   * @param {AES} aes The send AES instance
   * @return {Buffer} Returns the encrypted Buffer
   */
  encode(data) {
    const header = this.aes.getPacketHeader(data.length);
    data = this.shanda.encrypt(data);
    data = this.aes.transform(data);
    const encPacket = Buffer.concat([header, data]);
    return encPacket;
  }
  /**
   * Decodes a packet using MapleStory decoding
   * @param {Buffer} data The input data Buffer
   * @param {AES} aes The receive AES instance
   * @return {Object} Returns an object with {header, data}
   */
  decode(data, readOp=true) {
    let dataNoHeader = data.slice(4);
    let header = data.slice(0, 4);
    // TODO: Debug getPacketLength
    // const parsed = new Parser(header).int().collect(['header']);
    // console.log(parsed);
    // console.log(aes._getPacketLength(parsed.header));
    dataNoHeader = this.aes.transform(dataNoHeader);
    dataNoHeader = this.shanda.decrypt(dataNoHeader);
    if (!readOp) {
      return {header: header, data: dataNoHeader};
    }
    const opcode = Parser.from(dataNoHeader).short().get();
    return {header: header, opcode, data: dataNoHeader.slice(2)};
  }
}
module.exports = Encoder;