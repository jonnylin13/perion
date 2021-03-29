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
    case 'GMST':
    case 'TESP':
      return {iv: GMS_IV, aesKey: AES_KEY};
    case 'SEA': 
    case 'MSEA': 
    case 'KMS': 
    case 'KMST': 
    case 'JMS':
    case 'JMST':
      return {iv: SEA_IV, aesKey: AES_KEY};
    default:
      return {iv: DEFAULT_IV, aesKey: AES_KEY};
  }
}
/**
 * 
 * @param {*} variant 
 * @param {*} length 
 */
function getWZKey(variant, length) {
  length = (length & ~15) + ((length & 15) > 0 ? 16 : 0);
  const cipher = getCipher(variant);
  return generateKey(cipher.iv, cipher.aesKey, length);
}
/**
 * Generates an XOR key
 * @function
 * @param {Buffer} currentXorKey
 * @param {number} length
 * @return {Buffer}
 */
function generateKey(iv, aesKey, length) {
  let numBlocks = Math.round(length / 16);
  if (length % 16 !== 0) {
    numBlocks += 1;
  }
  const totalLength = numBlocks * 16;
  const xorKey = Buffer.alloc(totalLength);
  const cipher = crypto.createCipheriv('aes-256-ecb', aesKey, null);
  for (let i = 0; i < totalLength; i += 16) {
    let currentBlock = xorKey.slice(i, i+16);
    const encrypted = cipher.update(iv);
    encrypted.copy(xorKey, i);
    iv = currentBlock;
  }
  return xorKey;
}
/**
 * Transforms a Buffer
 * @function
 * @param {Buffer} data
 * @param {Buffer} key
 * @return {Buffer} The decrypted data
 */
function transform(data, key) {
  // TODO: Can this be reached?
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
  return {version: x, hash: y};
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
  constructor(variant, keyLength) {
    this.variant = variant;
    // From reWZ
    this._generateKeys(keyLength === undefined ? 0x10000 : keyLength);
  }
  /**
   * Decrypts an ASCII string
   * @param {Buffer} bytes
   * @param {boolean} encrypted
   * @return {string}
   */
  decryptASCII(bytes, encrypted=true) {
    this._checkKeyLength(bytes.length);
    const key = encrypted ? this._asciiEncKey : this._asciiKey;
    const decrypted = transform(bytes, key);
    return decrypted.toString('ascii');
  }
  /**
   * Decrypts a Unicode string
   * @param {Buffer} bytes
   * @param {boolean} encrypted
   * @return {string} 
   */
  decryptUnicode(bytes, encrypted=true) {
    this._checkKeyLength(bytes.length);
    const key = encrypted ? this._unicodeEncKey : this._unicodeKey;
    const decrypted = transform(bytes, key);
    return decrypted.toString('utf-8');
  }
  /**
   * Decrypts a Buffer of bytes
   * @param {Buffer} bytes 
   * @return {Buffer} The decrypted bytes
   */
  decrypt(bytes) {
    this._checkKeyLength(bytes.length);
    return transform(bytes, this._wzKey);
  }
  /**
   * Generates XOR keys for each type needed (WZ, Unicode, ASCII)
   * @param {number} length 
   */
  _generateKeys(length) {
    this._wzKey = getWZKey(this.variant, length);
    this._asciiEncKey = Buffer.alloc(this._wzKey.length);
    this._asciiKey = Buffer.alloc(this._wzKey.length);
    this._unicodeEncKey = Buffer.alloc(this._wzKey.length);
    this._unicodeKey = Buffer.alloc(this._wzKey.length);

    let mask = 0xAA;
    for (let i = 0; i < this._wzKey.length; ++i, ++mask) {
      this._asciiKey[i] = mask;
      this._asciiEncKey[i] = this._wzKey[i] ^ mask;
    }
    mask = 0xAAAA;
    for (let i = 0; i < this._wzKey.length / 2; i += 2, ++mask) {
      this._unicodeKey[i] = mask & 0xff;
      this._unicodeKey[i+1] = ((mask & 0xff00) >> 8);
      this._unicodeEncKey[i] = this._wzKey[i] ^ this._unicodeKey[i];
      this._unicodeEncKey[i+1] = this._wzKey[i+1] ^ this._unicodeKey[i+1];
    }
  }
  /**
   * Checks key length and provisions more bytes if needed
   * @param {number} length
   */
  _checkKeyLength(length) {
    if (this._wzKey.length < length) this._generateKeys(length);
  }
}
module.exports = {AES, calculateHash, rotl, rotr};
