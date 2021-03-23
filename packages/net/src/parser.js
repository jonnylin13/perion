/**
 * Parses binary packet Buffers in little endian
 * @class
 * @memberof module:@perion/net
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
   * 
   * Static constructor
   * @static
   * @param {Buffer} data The input data Buffer
   * @return {Parser}
   */
  static from(data) {
    return new Parser(data);
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
    const bool = this.byte().get();
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
    const short = this.data.readInt16LE(this.offset);
    this.offset += 2;
    this.parsed.push(short);
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
    this.parsed.push(String.fromCharCode(97 + this.short().get()));
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
      stringBuffer[i] = this.byte().get();
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
      const byte = this.byte().get(); /** Read until 0 */
      if (byte === 0) break;
      stringArr.push(byte);
    }
    this.parsed.push(Buffer.from(stringArr).toString('ascii'));
    return this;
  }
  /**
   * Reads a MapleStory ASCII string
   * @return {Parser} Returns a reference to the current Parser
   */
  mapleascii() {
    const length = this.short().get();
    this.parsed.push(this.ascii(length).get());
    return this;
  }
  /**
   * Reads a position (x, y)
   * @return {Parser} Returns a reference to the current Parser
   */
  pos() {
    const x = this.short().get();
    const y = this.short().get();
    this.parsed.push({x, y});
    return this;
  }
  /**
   * Reads a specified length
   * @param {number} length
   * @return {Parser} Returns a reference to the current Parser
   */
  read(length) {
    const ret = Buffer.alloc(length);
    for (let i = 0; i < length; i++) {
      ret[i] = this.byte().get();
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
  /**
   * Gets the last parsed value, removes it from the parsed list.
   * Set the option flag removeParsed=false to override
   * @param {Object} options {removeParsed}
   * @return {any} Any piece of data
   */
  get(removeParsed=true) {
    if (!removeParsed) return this.parsed[this.parsed.length - 1];
    const latest = this.parsed.pop();
    return latest;
  }
}
module.exports = Parser;
