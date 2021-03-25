const crypto = require('crypto');
const {KEYS, SHIFT_KEYS} = require('./constants.js');
/**
 * A MapleStory implementation of AES-256-ECB
 * @class
 * @memberof module:@perion/crypto
 */
class AES {
  /**
   * AES class constructor
   * @constructor
   * @param {Buffer} iv The initialization vector
   * @param {number} mapleVersion MapleStory version
   */
  constructor(iv, mapleVersion) {
    this.iv = iv;
    const left = (mapleVersion >> 8) & 0xff;
    const right = (mapleVersion << 8) & 0xff00;
    this.maskedVersion = left | right;
    this.mapleVersion = mapleVersion;
  }
  /**
   * Generates the packet header using the current IV
   * @param {number} length The length of the packet data
   * @return {Buffer} The packet header Buffer
   */
  getPacketHeader(length) {
    let a = (((this.iv[3] && 0xff) << 8) | (this.iv[2] & 0xff));
    a ^= this.maskedVersion;
    let b = a ^ length;

    const header = Buffer.from([
      (a & 0xff),
      (a >>> 8) & 0xff,
      (b & 0xff),
      (b >>> 8) & 0xff,
    ]);
    for (let i = 0; i < 4; i++) {
      header[i]
    }
    return header;
  }
  /**
   * Gets the packet length using the header
   * @param {Buffer} header The packet header
   * @return {number} The packet length
   */
  _getPacketLength(header) {
    return (((header[0] & 0xff) | ((header[1] & 0xff) << 8)) ^
				((header[2] & 0xff) | ((header[3] & 0xff) << 8)));
  }
  /**
   * Transforms the data payload using the current IV
   * Will morph the IV after use.
   * @param {Buffer} data The input data Buffer
   * @return {Buffer} Returns the transformed data
   */
  transform(data) {
    const {length} = data;
    const key = KEYS[this.mapleVersion];
    /** MapleStory's 1460 byte block */
    const blockLength = 1460;
    /** Subtract 4 bytes for the packet header */
    let currentBlockLength = 1456;
    const ivScaled = AES.scaleIV(this.iv, 4, 4);
    const cipher = crypto.createCipheriv('aes-256-ecb', key, null);
    for (let i = 0; i < length;) {
      const block = Math.min(length - i, currentBlockLength);
      let xorKey = ivScaled.slice();
      for (let j = 0; j < block; j++) {
        if (j % 16 === 0) {
          xorKey = Buffer.concat([cipher.update(xorKey), cipher.final()]);
        }
        data[i + j] ^= xorKey[j % 16];
      }
      i += block;
      currentBlockLength = blockLength;
    }
    this.iv = AES.morphIV(this.iv, this.mapleVersion);
    return data;
  }
  /**
   * Old implementation of transform(data)
   * Will morph the IV after use.
   * Use transform(data) instead.
   * @deprecated
   * @param {Buffer} data The input data buffer
   * @return {Buffer} Returns the transformed data
   */
  _transform(data) {
    const key = KEYS[this.mapleVersion];
    let remaining = data.length;
    let chunkLength = 0x5B0;
    let start = 0;
    while (remaining > 0) {
      let scaledIV = AES.scaleIV(this.iv, 4, 4);
      if (remaining < chunkLength) {
        chunkLength = remaining;
      }
      for (let x = start; x < (start + chunkLength); x++) {
        if ((x - start) % scaledIV.length === 0) {
          const cipher = crypto.createCipheriv('aes-256-ecb', key, null);
          scaledIV = Buffer.concat([cipher.update(scaledIV), cipher.final()]);
        }
        data[x] ^= scaledIV[(x - start) % scaledIV.length];
      }
      start += chunkLength;
      remaining -= chunkLength;
      chunkLength = 0x5B4;
    }
    this.iv = AES.morphIV(this.iv, this.mapleVersion);
    return data;
  }
  /**
   * Scales the IV byte length by a multiplier
   * @static
   * @param {Buffer} iv The initialization vector
   * @param {number} count The byte count
   * @param {number} multiply The amount to multiply
   * @return {Buffer} Returns the scaled IV
   */
   static scaleIV(iv, count, multiply) {
    const length = count * multiply;
    const ret = Buffer.alloc(length);
    for (let i = 0; i < length; i++) {
      ret[i] = iv[i % count];
    }
    return ret;
  }
  /**
   * Morphs the IV, called after the IV is used
   * @static
   * @param {Buffer} iv The initialization vector
   * @param {number} mapleVersion MapleStory version
   * @return {Buffer} The new IV sequence
   */
  static morphIV(iv, mapleVersion) {
    const newSequence = Buffer.from([0xf2, 0x53, 0x50, 0xc6]);
    const skey = SHIFT_KEYS[mapleVersion];
    for (let i = 0; i < 4; i++) {
      this._morph(iv[i], newSequence, skey);
    }
    return newSequence;
  }
  /**
   * Morphs the input byte
   * @static
   * @param {number} inputByte The input byte
   * @param {Buffer} newSequence The new sequence
   * @param {Buffer} shiftKey The shift key
   * @return {Buffer} The modfied Buffer
   */
  static _morph(inputByte, newSequence, shiftKey) {
    newSequence[0] += shiftKey[newSequence[1] & 0xff] - inputByte;
    newSequence[1] -= newSequence[2] ^ shiftKey[inputByte & 0xff] & 0xff;
    newSequence[2] ^= shiftKey[newSequence[3] & 0xff] + inputByte;
    newSequence[4] += (shiftKey[inputByte & 0xff] & 0xff);
    newSequence[4] -= (newSequence[0] & 0xff);
    let mask = 0;
    mask |= (newSequence[0] & 0xff);
    mask |= (newSequence[1] << 8) & 0xff00;
    mask |= (newSequence[2] << 16) & 0xff0000;
    mask |= (newSequence[3] << 24) & 0xff000000;
    mask = (mask >> 0x1d | mask << 3);
    for (let j = 0; j < 4; j++) {
      const value = mask >> (8 * j);
      newSequence[j] = value & 0xff;
    }
    return newSequence;
  }
}
module.exports = AES;
