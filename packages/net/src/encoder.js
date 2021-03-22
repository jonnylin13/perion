const Shanda = require('@perion/crypto').Shanda;
// const {Parser} = require('./parser.js');
/**
 * Encodes a packet using MapleStory encoding
 * @function encode
 * @param {Buffer} data 
 * @param {@perion/crypto.AES} aes 
 * @return {Buffer}
 */
function encode(data, aes) {
  const header = aes.getPacketHeader(data.length);
  data = Shanda.encrypt(data);
  data = aes.transform(data);
  const encPacket = Buffer.concat([header, data]);
  return encPacket;
}
/**
 * Decodes a packet using MapleStory decoding
 * @function decode
 * @param {Buffer} data 
 * @param {@perion/crypto.AES} aes 
 * @return {Object} Returns an object with {header, data}
 */
function decode(data, aes) {
  let dataNoHeader = data.slice(4);
  let header = data.slice(0, 4);
  /** TODO: Debug getPacketLength */
  // const parsed = new Parser(header).int().collect(['header']);
  // console.log(parsed);
  // console.log(aes._getPacketLength(parsed.header));
  dataNoHeader = aes.transform(dataNoHeader);
  dataNoHeader = Shanda.decrypt(dataNoHeader);
  return {header: header, data: dataNoHeader};
}
module.exports = {encode, decode};