/**
 * Parses binary packet Buffers in little endian
 * @class
 */
 class Parser {
  /**
   * @constructor
   * @param {Buffer} data
   */
  constructor(data) {
    this.data = data;
    this.offset = 0;
    this.parsed = [];
  }
  /**
   * Reads a byte
   * @method
   * @return {Parser}
   */
  byte() {
    const byte = this.data.readIntLE(this.offset, 1);
    this.offset += 1;
    this.parsed.push(byte);
    return this;
  }
  /**
   * Reads a boolean
   * @method
   * @return {Parser}
   */
  bool() {
    const bool = this.readByte();
    this.parsed.push(bool === 1 ? true : false);
    return this;
  }
  /**
   * Reads an unsigned byte
   * @method
   * @return {Parser}
   */
  ubyte() {
    const uByte = this.data.readUIntLE(this.offset, 1);
    this.offset += 1;
    this.parsed.push(uByte);
    return this;
  }
  /**
   * Reads a short
   * @method
   * @return {Parser}
   */
  short() {
    const uByte = this.data.readUIntLE(this.offset, 1);
    this.offset += 1;
    this.parsed.push(uByte);
    return this;
  }
  /**
   * Reads an unsigned short
   * @method
   * @return {Parser}
   */
  ushort() {
    const uShort = this.data.readUInt16LE(this.offset);
    this.offset += 2;
    this.parsed.push(uShort);
    return this;
  }
  /**
   * Reads a character
   * @method
   * @return {Parser}
   */
  char() {
    this.parsed.push(String.fromCharCode(97 + this.readShort()));
    return this;
  }
  /**
   * Reads an integer
   * @method
   * @return {Parser}
   */
  int() {
    const int = this.data.readInt32LE(this.offset);
    this.offset += 4;
    this.parsed.push(int);
    return this;
  }
  /**
   * Reads an unsigned integer
   * @method
   * @return {Parser}
   */
  uint() {
    const uInt = this.data.readUInt32LE(this.offset);
    this.offset += 4;
    this.parsed.push(uInt);
    return this;
  }
  /**
   * Reads a long
   * @method
   * @return {Parser}
   */
  long() {
    const long = this.data.readBigInt64LE(this.offset);
    this.offset += 8;
    this.parsed.push(long);
    return this;
  }
  /**
   * Reads an unsigned long
   * @method
   * @return {Parser}
   */
  ulong() {
    const uLong = this.data.readBigUInt64LE(this.offset);
    this.offset += 8;
    this.parsed.push(uLong);
    return this;
  }
  /**
   * Reads a double
   * @method
   * @return {Parser}
   */
  double() {
    const double = this.data.readDoubleLE(this.offset);
    this.offset += 8;
    this.parsed.push(double);
    return this;
  }
  /**
   * Reads an ASCII string
   * @method
   * @param {number} length Length of the string
   * @return {Parser}
   */
  ascii(length) {
    const stringBuffer = Buffer.alloc(length);
    for (let i = 0; i < length; i++) {
      stringBuffer[i] = this.readByte();
    }
    this.parsed.push(stringBuffer.toString('ascii'));
    return this;
  }
  /**
   * Reads a null terminated ASCII string
   * @method
   * @return {Parser}
   */
  nullascii() {
    const stringArr = [];
    const done = false; /** eslint */
    while (!done) {
      const byte = this.readByte(); /** Read until 0 */
      if (byte === 0) break;
      stringArr.push(byte);
    }
    return Buffer.from(stringArr).toString('ascii');
  }
  /**
   * Reads a MapleStory ASCII string
   * @method
   * @return {Parser}
   */
  mapleascii() {
    const length = this.readShort();
    this.parsed.push(this.readAsciiString(length));
    return this;
  }
  /**
   * Reads a position (x, y)
   * @method
   * @return {Parser}
   */
  pos() {
    const x = this.readShort();
    const y = this.readShort();
    return {x, y};
  }
  /**
   * Reads a specified length
   * @method
   * @param {number} length
   * @return {Parser}
   */
  read(length) {
    const ret = Buffer.alloc(length);
    for (let i = 0; i < length; i++) {
      ret[i] = this.readByte();
    }
    this.parsed.push(ret);
    return this;
  }
  /**
   * Skips the cursor a specified length
   * @method
   * @param {number} length
   * @return {Parser}
   */
  skip(length) {
    this.offset += length;
    return this;
  }
  /**
   * Moves the cursor to a specified byte offset
   * @method
   * @param {number} offset
   * @return {Parser}
   */
  seek(offset) {
    this.offset = offset;
    return this;
  }
  /**
   * Collects the parsed values and maps them to the input array strings
   * Will clear the parsed values
   * @method
   * @param {Array<string>} fieldNames
   * @return {Map<string, ?>}
   */
  collect(fieldNames) {
    if (fieldNames.length !== this.parsed.length) return false;
    const ret = {};
    const length = fieldNames.length;
    for (let i = 0; i < length; i++) {
      ret[fieldNames[i]] = this.parsed[i];
    }
    this.parsed = [];
    return ret;
  }
}
module.exports = {Parser};
