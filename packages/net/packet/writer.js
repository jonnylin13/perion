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
   * Used to allocated more bytes to the Buffer dynamically
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
module.exports = {Writer};
