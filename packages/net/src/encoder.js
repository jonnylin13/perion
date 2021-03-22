const Shanda = require('@perion/crypto').Shanda;
/**
 * Provides encode and decode functions for MapleStory packets
 * @class
 * @link module:@perion/net
 */
class Encoder {
  /**
   * Encodes a packet using MapleStory encoding
   * @param {Buffer} data The output data buffer
   * @param {AES} aes The send AES instance
   * @return {Buffer} Returns the encrypted Buffer
   */
  static encode(data, aes) {
    const header = aes.getPacketHeader(data.length);
    data = Shanda.encrypt(data);
    data = aes.transform(data);
    const encPacket = Buffer.concat([header, data]);
    return encPacket;
  }
  /**
   * Decodes a packet using MapleStory decoding
   * @param {Buffer} data The input data Buffer
   * @param {AES} aes The receive AES instance
   * @return {Object} Returns an object with {header, data}
   */
  static decode(data, aes) {
    let dataNoHeader = data.slice(4);
    let header = data.slice(0, 4);
    // TODO: Debug getPacketLength
    // const parsed = new Parser(header).int().collect(['header']);
    // console.log(parsed);
    // console.log(aes._getPacketLength(parsed.header));
    dataNoHeader = aes.transform(dataNoHeader);
    dataNoHeader = Shanda.decrypt(dataNoHeader);
    return {header: header, data: dataNoHeader};
  }
}
module.exports = Encoder;