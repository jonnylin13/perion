/**
 * Parses binary packet Buffers in little endian
 * @class
 */
 class Parser {
  /**
   * @constructor
   * @param {Buffer} data The input data Buffer
   */
  constructor(data) {
    this.data = data;
    this.offset = 0;
    this.parsed = [];
  }
  /**
   * Reads a byte
   * @return {Parser} Returns a reference to the current Parser
   */
  byte() {
    const byte = this.data.readIntLE(this.offset, 1);
    this.offset += 1;
    this.parsed.push(byte);
    return this;
  }
  /**
   * Reads a boolean
   * @return {Parser} Returns a reference to the current Parser
   */
  bool() {
    const bool = this.readByte();
    this.parsed.push(bool === 1 ? true : false);
    return this;
  }
  /**
   * Reads an unsigned byte
   * @return {Parser} Returns a reference to the current Parser
   */
  ubyte() {
    const uByte = this.data.readUIntLE(this.offset, 1);
    this.offset += 1;
    this.parsed.push(uByte);
    return this;
  }
  /**
   * Reads a short
   * @return {Parser} Returns a reference to the current Parser
   */
  short() {
    const uByte = this.data.readUIntLE(this.offset, 1);
    this.offset += 1;
    this.parsed.push(uByte);
    return this;
  }
  /**
   * Reads an unsigned short
   * @return {Parser} Returns a reference to the current Parser
   */
  ushort() {
    const uShort = this.data.readUInt16LE(this.offset);
    this.offset += 2;
    this.parsed.push(uShort);
    return this;
  }
  /**
   * Reads a character
   * @return {Parser} Returns a reference to the current Parser
   */
  char() {
    this.parsed.push(String.fromCharCode(97 + this.readShort()));
    return this;
  }
  /**
   * Reads an integer
   * @return {Parser} Returns a reference to the current Parser
   */
  int() {
    const int = this.data.readInt32LE(this.offset);
    this.offset += 4;
    this.parsed.push(int);
    return this;
  }
  /**
   * Reads an unsigned integer
   * @return {Parser} Returns a reference to the current Parser
   */
  uint() {
    const uInt = this.data.readUInt32LE(this.offset);
    this.offset += 4;
    this.parsed.push(uInt);
    return this;
  }
  /**
   * Reads a long
   * @return {Parser} Returns a reference to the current Parser
   */
  long() {
    const long = this.data.readBigInt64LE(this.offset);
    this.offset += 8;
    this.parsed.push(long);
    return this;
  }
  /**
   * Reads an unsigned long
   * @return {Parser} Returns a reference to the current Parser
   */
  ulong() {
    const uLong = this.data.readBigUInt64LE(this.offset);
    this.offset += 8;
    this.parsed.push(uLong);
    return this;
  }
  /**
   * Reads a double
   * @return {Parser} Returns a reference to the current Parser
   */
  double() {
    const double = this.data.readDoubleLE(this.offset);
    this.offset += 8;
    this.parsed.push(double);
    return this;
  }
  /**
   * Reads an ASCII string
   * @param {number} length Length of the string
   * @return {Parser} Returns a reference to the current Parser
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
   * @return {Parser} Returns a reference to the current Parser
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
   * @return {Parser} Returns a reference to the current Parser
   */
  mapleascii() {
    const length = this.readShort();
    this.parsed.push(this.readAsciiString(length));
    return this;
  }
  /**
   * Reads a position (x, y)
   * @return {Parser} Returns a reference to the current Parser
   */
  pos() {
    const x = this.readShort();
    const y = this.readShort();
    return {x, y};
  }
  /**
   * Reads a specified length
   * @param {number} length
   * @return {Parser} Returns a reference to the current Parser
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
   * @param {number} length
   * @return {Parser} Returns a reference to the current Parser
   */
  skip(length) {
    this.offset += length;
    return this;
  }
  /**
   * Moves the cursor to a specified byte offset
   * @param {number} offset
   * @return {Parser} Returns a reference to the current Parser
   */
  seek(offset) {
    this.offset = offset;
    return this;
  }
  /**
   * Collects the parsed values and maps them to the input array strings
   * Will clear the parsed values
   * @param {Array<string>} fieldNames Names mapped to values
   * @return {Map<string, any>} The object with {name:value}
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
