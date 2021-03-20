import * as crypto from 'crypto';
import {KEYS, SHIFT_KEYS} from './constants.js';
/**
 * An internal class that provides utility functions for AES
 * @class
 */
class Util {
  /**
   * Scales the IV byte length by a multiplier
   * @function
   * @static
   * @param {Buffer} iv
   * @param {number} count
   * @param {number} multiply
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
   * @function
   * @static
   * @param {Buffer} iv
   * @param {number} mapleVersion
   * @return {Buffer} The new IV sequence
   */
  static morphIV(iv, mapleVersion) {
    const newSequence = Buffer.from([0xf2, 0x53, 0x50, 0xc6]);
    const SHIFT_KEY = SHIFT_KEYS[mapleVersion];
    for (let i = 0; i < 4; i++) {
      const input = iv[i];
      const tableInput = SHIFT_KEY[input];
      newSequence[0] += SHIFT_KEY[newSequence[1] - input];
      newSequence[1] -= newSequence[2] ^ tableInput;
      newSequence[2] ^= SHIFT_KEY[newSequence[3]] + input;
      newSequence[3] -= newSequence[0] - tableInput;
      let val =
        (
          newSequence[0] |
          ((newSequence[1] & 0xff) << 8 |
          ((newSequence[2] & 0xff) << 16) |
          ((newSequence[3]) & 0xff) << 24)
        ) >>> 0;
      let val2 = val >>> 0x1d;
      val = (val << 0x03) >>> 0;
      val2 |= val;
      newSequence[0] = val2 & 0xff;
      newSequence[1] = (val2 >> 8) & 0xff;
      newSequence[2] = (val2 >> 16) & 0xff;
      newSequence[3] = (val2 >> 24) & 0xff;
    }
    return newSequence;
  }
}
/**
 * A MapleStory implementation of AES-256-ECB
 * @class
 */
export class AES {
  /**
   * AES class constructor
   * @constructor
   * @param {Buffer} iv
   * @param {number} mapleVersion
   */
  constructor(iv, mapleVersion) {
    this.iv = iv;
    const left = (mapleVersion >> 8) & 0xff;
    const right = (mapleVersion << 8) & 0xff00;
    this.mapleVersion = left | right;
    /** Not sure if this is the correct encryption algorithm */
    const key = KEYS[this.mapleVersion];
    this.cipher = crypto.createCipheriv('aes-256-ecb', key, null);
  }
  /**
   * Generates the packet header using the current IV
   * @method
   * @param {number} length
   * @return {Buffer} The packet header Buffer
   */
  getPacketHeader(length) {
    let a = (this.iv[3] & 0xff);
    a |= (this.iv[2] << 8) & 0xff00;
    a ^= this.mapleVersion;
    const b = a ^ (((length << 8) & 0xff00) | length >>> 8);
    const header = Buffer.from([
      (a >>> 8) & 0xff,
      a & 0xff,
      (b >>> 8) & 0xff,
      b & 0xff,
    ]);
    return header;
  }
  /**
   * Transforms the data payload using the current IV
   * Will morph the IV after use.
   * @method
   * @param {Buffer} data
   * @return {Buffer} Returns the transformed data
   */
  transform(data) {
    const {length} = data;
    /** MapleStory's 1460 byte block */
    const blockLength = 1460;
    /** Subtract 4 bytes for the packet header */
    let currentBlockLength = 1456;
    const ivScaled = Util.scaleIV(this.iv, 4, 4);
    for (let i = 0; i < length;) {
      const block = Math.min(length - i, currentBlockLength);
      let xorKey = ivScaled.slice();
      for (let j = 0; j < block; j++) {
        if (j % 16 === 0) {
          xorKey = this.cipher.update(xorKey);
        }
        data[i + j] ^= xorKey[j % 16];
      }
      i += block;
      currentBlockLength = blockLength;
    }
    this.iv = Util.morphIV(this.iv);
    return data;
  }
  /**
   * Old implementation of transform(data)
   * Will morph the IV after use.
   * Use transform(data) instead.
   * @method
   * @deprecated
   * @param {Buffer} data
   * @return {Buffer} Returns the transformed data
   */
  _transform(data) {
    let remaining = data.length;
    let chunkLength = 0x5B0;
    let start = 0;
    while (remaining > 0) {
      let myIv = Util.scaleIV(this.iv, 4, 4);
      if (remaining < chunkLength) {
        chunkLength = remaining;
      }
      for (let x = start; x < (start + chunkLength); x++) {
        if ((x - start) % myIv.length === 0) {
          myIv = this.cipher.update(myIv);
        }
        data[x] ^= myIv[(x - start) % myIv.length];
      }
      start += chunkLength;
      remaining -= chunkLength;
      chunkLength = 0x5B4;
    }
    this.iv = Util.morphIV(this.iv);
    return data;
  }
}
