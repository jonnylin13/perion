/**
 * MapleStory custom Shanda encryption implementation
 * @class
 * @memberof module:@perion/crypto
 */
class Shanda {
  /**
   * Rotate right operation
   * @static
   * @param {number} value The input value
   * @param {number} shift The amount to shift
   * @return {number} The shifted value
   */
  static rol(value, shift) {
    const overflow = ((value >>> 0) << shift % 8) >>> 0;
    const ret = ((overflow & 0xff) | (overflow >>> 8) & 0xff);
    return ret;
  }
  /**
   * Rotate left operation
   * @static
   * @param {number} value The input value
   * @param {number} shift The amount to shift
   * @return {number} The shifted value
   */
  static ror(value, shift) {
    const overflow = ((value >>> 0) << 8) >>> shift % 8;
    const ret = ((overflow & 0xff) | (overflow >>> 8)) & 0xff;
    return ret;
  }
  /**
   * Encrypts a Buffer of data using Maple Shanda encryption
   * @static
   * @param {Buffer} data The input Buffer to encrypt
   * @return {Buffer} The encrypted Buffer
   */
  static encrypt(data) {
    const {length} = data;
    let j;
    let a;
    let c;
    for (let i = 0; i < 3; i++) {
      a = 0;
      for (j = length; j > 0; j--) {
        c = data[length - j];
        c = Shanda.rol(c, 3);
        c += j;
        c &= 0xff; 
        c ^= a;
        a = c;
        c = Shanda.ror(a, j);
        c ^= 0xff;
        c += 0x48;
        c &= 0xff;
        data[length - j] = c;
      }
      a = 0;
      for (j = length; j > 0; j--) {
        c = data[j - 1];
        c = Shanda.rol(c, 4);
        c += j;
        c &= 0xff; 
        c ^= a;
        a = c;
        c ^= 0x13;
        c = Shanda.ror(c, 3);
        data[j - 1] = c;
      }
    }
    return data;
  }
  /**
   * Decrypts a Buffer of data using Maple Shanda Encryption
   * @static
   * @param {Buffer} data A Shanda encrypted input Buffer
   * @return {Buffer} The decrypted buffer
   */
  static decrypt(data) {
    for (let j = 1; j <= 6; j++) {
      let remember = 0;
      let dataLength = (data.length & 0xff);
      let nextRemember;
      if (j % 2 == 0) {
        for (let i = 0; i < data.length; i++) {
          let cur = data[i];
          cur -= 0x48;
          cur =  ((~cur) & 0xff);
          cur = Shanda.rol(cur, dataLength & 0xff);
          nextRemember = cur;
          cur ^= remember;
          remember = nextRemember;
          cur -= dataLength;
          cur = Shanda.ror(cur, 3);
          data[i] = cur;
          dataLength--;
        }
      } else {
        for (let i = data.length - 1; i >= 0; i--) {
          let cur = data[i];
          cur = Shanda.rol(cur, 3);
          cur ^= 0x13;
          nextRemember = cur;
          cur ^= remember;
          remember = nextRemember;
          cur -= dataLength;
          cur = Shanda.ror(cur, 4);
          data[i] = cur;
          dataLength--;
        }
      }
    }
    return data;
  }
}
module.exports = Shanda;
