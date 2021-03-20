
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
    return ret;
  }
}
/**
 * Writes packets in little endian format
 * @class
 */
class Writer {
  /**
   * @constructor
   * @param {number} length
   */
  constructor(length = 32) {
    this.data = Buffer.alloc(length);
    this.bytesWritten = 0;
  }
  /**
   * Used to allocated more bytes to the Buffer
   * @method
   * @param {number} byteSize Total byte length required
   */
  dynamicAlloc(byteSize) {
    const bytesAvailable = this.data.length - this.bytesWritten;
    if (bytesAvailable < byteSize) {
      const bytesNeeded = byteSize - bytesAvailable;
      this.data = Buffer.alloc(this.data.length + bytesNeeded, this.data);
    }
  }
  /**
   * Writes a byte
   * @method
   * @param {number} byte
   * @return {Writer}
   */
  byte(byte) {
    this.dynamicAlloc(1);
    this.data.writeIntLE(byte, this.bytesWritten, 1);
    this.bytesWritten += 1;
    return this;
  }
  /**
   * Writes an unsigned byte
   * @method
   * @param {number} uByte
   * @return {Writer}
   */
  ubyte(uByte) {
    this.dynamicAlloc(1);
    this.data.writeUIntLE(uByte, this.bytesWritten, 1);
    this.bytesWritten += 1;
    return this;
  }
  /**
   * Writes a short
   * @method
   * @param {number} short
   * @return {Writer}
   */
  short(short) {
    this.dynamicAlloc(2);
    this.data.writeInt16LE(short, this.bytesWritten);
    this.bytesWritten += 2;
    return this;
  }
  /**
   * Writes an unsigned short
   * @method
   * @param {number} uShort
   * @return {Writer}
   */
  ushort(uShort) {
    /* Lol u short */
    this.dynamicAlloc(2);
    this.data.writeUInt16LE(uShort, this.bytesWritten);
    this.bytesWritten += 2;
    return this;
  }
  /**
   * Writes an integer
   * @method
   * @param {number} int
   * @return {Writer}
   */
  int(int) {
    this.dynamicAlloc(4);
    this.data.writeInt32LE(int, this.bytesWritten);
    this.bytesWritten += 4;
    return this;
  }
  /**
   * Writes an unsigned integer
   * @method
   * @param {number} uInt
   * @return {Writer}
   */
  uint(uInt) {
    this.dynamicAlloc(4);
    this.data.writeUInt32LE(uInt, this.bytesWritten);
    this.bytesWritten += 4;
    return this;
  }
  /**
   * Writes a long
   * @method
   * @param {bigint} long
   * @return {Writer}
   */
  long(long) {
    this.dynamicAlloc(8);
    this.data.writeBigInt64LE(long, this.bytesWritten);
    this.bytesWritten += 8;
    return this;
  }
  /**
   * Writes an unsigned long
   * @method
   * @param {bigint} uLong
   * @return {Writer}
   */
  ulong(uLong) {
    this.dynamicAlloc(8);
    this.data.writeBigUInt64LE(uLong, this.bytesWritten);
    this.bytesWritten += 8;
    return this;
  }
  /**
   * Writes a Buffer
   * @method
   * @param {Buffer} buf
   * @return {Writer}
   */
  write(buf) {
    for (const byte of buf) this.writeByte(byte);
    return this;
  }
  /**
   * Writes an ASCII string
   * @method
   * @param {string} str
   * @return {Writer}
   */
  ascii(str) {
    this.write(Buffer.from(str, 'utf-8'));
    return this;
  }
  /**
   * Writes a null-terminated ASCII string
   * @method
   * @param {string} str
   * @return {Writer}
   */
  nullascii(str) {
    this.ascii(str);
    this.byte(0);
    return this;
  }
  /**
   * Writes a MapleStory ASCII string
   * @method
   * @param {string} str
   * @return {Writer}
   */
  mapleascii(str) {
    this.short(str.length);
    this.ascii(str);
    return this;
  }
  /**
   * Writes a position (x, y)
   * @method
   * @param {Point} pos
   * @return {Writer}
   */
  pos(pos) {
    this.short(pos.x);
    this.short(pos.y);
    return this;
  }
  /**
   * Writes a boolean value
   * @method
   * @param {boolean} bool
   * @return {Writer}
   */
  bool(bool) {
    this.byte(bool ? 1 : 0);
    return this;
  }
  /**
   * Returns the packet Buffer
   * @method
   * @return {Buffer}
   */
  buffer() {
    return this.data;
  }
}
module.exports = {Parser, Writer};
