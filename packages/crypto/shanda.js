
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
  static rollLeft(value, shift) {
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
  static rollRight(value, shift) {
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
export function encrypt(data) {
  const {length} = data;
  let j;
  let a;
  let c;
  for (let i = 0; i < 3; i++) {
    a = 0;
    for (j = length; j > 0; j--) {
      c = data[length - j];
      c = Util.rollLeft(c, 3);
      c += j;
      c &= 0xff; /** Addition */
      c ^= a;
      a = c;
      c = Util.rollRight(a, j);
      c ^= 0xff;
      c += 0x48;
      c &= 0xff; /** Addition */
      data[length - j] = c;
    }
    a = 0;
    for (j = length; j > 0; j--) {
      c = data[j - 1];
      c = Util.rollLeft(c, 4);
      c += j;
      c &= 0xff; /** Addition */
      c ^= a;
      a = c;
      c ^= 0x13;
      c = Util.rollRight(c, 3);
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
export function decrypt(data) {
  const {length} = data;
  let j;
  let a;
  let c;
  for (let i = 0; i < 3; i++) {
    a = 0;
    for (j = length; j > 0; j--) {
      c = data[length - j];
      c = Util.rollLeft(c, 3);
      c += j;
      c &= 0xff; /** Addition */
      c ^= a;
      a = c;
      c = Util.rollRight(a, j);
      c ^= 0xff;
      c += 0x48;
      c &= 0xff; /** Addition */
      data[length - j] = c;
    }
    a = 0;
    for (j = length; j > 0; j--) {
      c = data[j - 1];
      c = Util.rollLeft(c, 4);
      c += j;
      c &= 0xff; /** Addition */
      c ^= a;
      a = c;
      c ^= 0x13;
      c = Util.rollRight(c, 3);
      data[j - 1] = c;
    }
  }
  return data;
}
