const crypto = require('crypto');
const {AES_KEY, GMS_IV, SEA_IV, DEFAULT_IV} = require('./constants.js');
/**
 * Returns the AES key given a version
 * @function
 * @param {number} variant GMS or SEA
 * @return {Object} {iv: Buffer, aesKey: Buffer}
 */
function getCipher(variant) {
  switch(variant) {
    case 'GMS':
      return {iv: GMS_IV, aesKey: AES_KEY};
    case 'SEA':
      return {iv: SEA_IV, aesKey: AES_KEY};
    default:
      return {iv: DEFAULT_IV, aesKey: AES_KEY};
  }
}
/**
 * Expands the XOR key and returns it
 * @function
 * @param {Buffer} currentXorKey
 * @param {number} length
 * @return {Buffer}
 */
function expandXorKey(key, currentIV, currentXorKey, length) {
  let numBlocks = Math.round(length / 16);
  if (length % 16 != 0) {
    numBlocks += 1;
  }
  let finalLength = numBlocks * 16;
  finalLength -= currentXorKey.length;
  const nextBlockLength = finalLength - currentXorKey.length;
  const nextBlock = Buffer.alloc(nextBlockLength);
  // For each 16 byte block, encrypt the IV,
  // then use the resilt to do the next one
  const cipher = crypto.createCipheriv('aes-256-ecb', key, null);
  for (let i = 0; i < nextBlockLength; i += 16) {
    let currentBlock = nextBlock.slice(i, i+16);
    const encrypted = cipher.update(currentIV);
    encrypted.copy(nextBlock, i);
    currentIV = currentBlock;
  }
  currentXorKey = Buffer.concat([currentXorKey, nextBlock]);
  return {iv: currentIV, xorKey: currentXorKey}
}
/**
 * Transforms a Buffer
 * @function
 * @param {Buffer} data
 * @param {Buffer} key
 * @return {Buffer} The decrypted data
 */
function transform(data, key) {
  // NEVER REACHED
  // if (data.length > key.length) {
  //   throw new Error('Data length cannot be greater than key length');
  // }
  for (let i = 0; i < data.length; i++) {
    data[i] ^= key[i];
  }
  return data;
}
/**
 * Calculates the hash using MapleStory version
 * @param {number} version 
 * @return {{x: number, y: number}}
 */
function calculateHash(mapleVersion) {
  versionStr = mapleVersion.toString();
  const b = Buffer.from(versionStr, 'utf-8');
  let y = 0;
  for (const val of b) {
    y = y << 5;
    y += val + 1;
  }
  let x = 0xff;
  x ^= ((y >> 24) & 0xff);
	x ^= ((y >> 16) & 0xff);
	x ^= ((y >> 8) & 0xff);
	x ^= ((y >> 0) & 0xff);
  return {x, y};
}
/**
 * Bitshift to the left, puts the bits pushed off at the right
 * @function
 * @param {number} value
 * @param {number} offset
 * @return {number}
 */
function rotl(value, offset) {
  return ((value << offset) | (value >> (32 - offset)));
}
/**
 * Bitshift to the right, puts the bits pushed off at the left
 * @function
 * @param {number} value
 * @param {number} offset
 * @return {number}
 */
function rotr(value, offset) {
  return ((value >> offset) | (value << (32 - offset)));
}
/**
 * AES utility for parsing wz files
 * @class
 * @memberof module:@perion/wz
 */
class AES {
  /**
   * @constructor
   * @param {string} variant GMS or SEA
   */
  constructor(variant) {
    this.variant = variant;
    const {aesKey, iv} = getCipher(variant);
    this.aesKey = aesKey;
    this.xorKey = Buffer.from([]);
    this.iv = iv;
    this.encryptedStrings = [];
  }
  /**
   * Returns true if the input string is encrypted
   * @param {string} input
   * @return {boolean}
   */
  isEncrypted(input) {
    return this.encryptedStrings.includes(input);
  }
  /**
   * Transforms a buffer
   * @param {Buffer} data
   * @return {Buffer}
   */
  transform(data) {
    this.provisionXorKey(data.length);
    return transform(data, this.xorKey);
  }
  /**
   * Provisions the XOR key
   * @param {number} length
   */
  provisionXorKey(length) {
    // TODO: What does this do?
    if (this.xorKey.length >= length) return;
    const result = expandXorKey(this.aesKey, this.iv, this.xorKey, length);
    this.iv = result.iv;
    this.xorKey = result.xorKey;
  }
}
module.exports = {AES, calculateHash, rotl, rotr};
