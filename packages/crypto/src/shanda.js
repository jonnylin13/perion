/**
 * Internal class with ror and rol operation for Shanda encryption
 * @class
 */
class Util {
  /**
   * Equivalent to rol operation
   * @function
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
   * Equivalent to ror operation
   * @function
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
}
/**
 * Encrypts a Buffer of data
 * @function
 * @param {Buffer} data The input Buffer to encrypt
 * @return {Buffer} The encrypted Buffer
 */
function encrypt(data) {
  const {length} = data;
  let j;
  let a;
  let c;
  for (let i = 0; i < 3; i++) {
    a = 0;
    for (j = length; j > 0; j--) {
      c = data[length - j];
      c = Util.rol(c, 3);
      c += j;
      c &= 0xff; /** Addition */
      c ^= a;
      a = c;
      c = Util.ror(a, j);
      c ^= 0xff;
      c += 0x48;
      c &= 0xff; /** Addition */
      data[length - j] = c;
    }
    a = 0;
    for (j = length; j > 0; j--) {
      c = data[j - 1];
      c = Util.rol(c, 4);
      c += j;
      c &= 0xff; /** Addition */
      c ^= a;
      a = c;
      c ^= 0x13;
      c = Util.ror(c, 3);
      data[j - 1] = c;
    }
  }
  return data;
}
/**
 * Decrypts a Buffer of data
 * @function
 * @param {Buffer} data A Shanda encrypted input Buffer
 * @return {Buffer} The decrypted buffer
 */
function decrypt(data) {
  for (let j = 1; j <= 6; j++) {
    let remember = 0;
    let dataLength = (data.length & 0xff);
    let nextRemember;
    if (j % 2 == 0) {
      for (let i = 0; i < data.length; i++) {
        let cur = data[i];
        cur -= 0x48;
        cur =  ((~cur) & 0xff);
        cur = Util.rol(cur, dataLength & 0xff);
        nextRemember = cur;
        cur ^= remember;
        remember = nextRemember;
        cur -= dataLength;
        cur = Util.ror(cur, 3);
        data[i] = cur;
        dataLength--;
      }
    } else {
      for (let i = data.length - 1; i >= 0; i--) {
        let cur = data[i];
        cur = Util.rol(cur, 3);
        cur ^= 0x13;
        nextRemember = cur;
        cur ^= remember;
        remember = nextRemember;
        cur -= dataLength;
        cur = Util.ror(cur, 4);
        data[i] = cur;
        dataLength--;
      }
    }
  }
  return data;
  // const {length} = data;
  // let j;
  // let a;
  // let c;
  // for (let i = 0; i < 3; i++) {
  //   a = 0;
  //   for (j = length; j > 0; j--) {
  //     c = data[length - j];
  //     c = Util.rol(c, 3);
  //     c += j;
  //     c &= 0xff; /** Addition */
  //     c ^= a;
  //     a = c;
  //     c = Util.ror(a, j);
  //     c ^= 0xff;
  //     c += 0x48;
  //     c &= 0xff; /** Addition */
  //     data[length - j] = c;
  //   }
  //   a = 0;
  //   for (j = length; j > 0; j--) {
  //     c = data[j - 1];
  //     c = Util.rol(c, 4);
  //     c += j;
  //     c &= 0xff; /** Addition */
  //     c ^= a;
  //     a = c;
  //     c ^= 0x13;
  //     c = Util.ror(c, 3);
  //     data[j - 1] = c;
  //   }
  // }
  // return data;
}
module.exports = {encrypt, decrypt, Util};
