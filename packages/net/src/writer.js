/**
 * Writes packets in little endian format
 * @class
 * @memberof module:@perion/net
 */
 class Writer {
  /**
   * @constructor
   * @param {number} length The length of the packet in bytes
   */
  constructor(length = 32) {
    this.data = Buffer.alloc(length);
    this.bytesWritten = 0;
  }
  /**
   * Used to allocated more bytes to the Buffer dynamically
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
   * @param {number} byte The byte to write
   * @return {Writer} A reference to the current Writer
   */
  byte(byte) {
    this.dynamicAlloc(1);
    this.data.writeIntLE(byte, this.bytesWritten, 1);
    this.bytesWritten += 1;
    return this;
  }
  /**
   * Writes an unsigned byte
   * @param {number} uByte An unsigned byte
   * @return {Writer} A reference to the current Writer
   */
  ubyte(uByte) {
    this.dynamicAlloc(1);
    this.data.writeUIntLE(uByte, this.bytesWritten, 1);
    this.bytesWritten += 1;
    return this;
  }
  /**
   * Writes a short
   * @param {number} short A short
   * @return {Writer} A reference to the current Writer
   */
  short(short) {
    this.dynamicAlloc(2);
    this.data.writeInt16LE(short, this.bytesWritten);
    this.bytesWritten += 2;
    return this;
  }
  /**
   * Writes an unsigned short
   * @param {number} uShort An unsigned short
   * @return {Writer} A reference to the current Writer
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
   * @param {number} int An integer
   * @return {Writer} A reference to the current Writer
   */
  int(int) {
    this.dynamicAlloc(4);
    this.data.writeInt32LE(int, this.bytesWritten);
    this.bytesWritten += 4;
    return this;
  }
  /**
   * Writes an unsigned integer
   * @param {number} uInt An unsigned integer
   * @return {Writer} A reference to the current Writer
   */
  uint(uInt) {
    this.dynamicAlloc(4);
    this.data.writeUInt32LE(uInt, this.bytesWritten);
    this.bytesWritten += 4;
    return this;
  }
  /**
   * Writes a long
   * @param {bigint} long A long
   * @return {Writer} A reference to the current Writer
   */
  long(long) {
    this.dynamicAlloc(8);
    this.data.writeBigInt64LE(long, this.bytesWritten);
    this.bytesWritten += 8;
    return this;
  }
  /**
   * Writes an unsigned long
   * @param {bigint} uLong An unsigned long
   * @return {Writer} A reference to the current Writer
   */
  ulong(uLong) {
    this.dynamicAlloc(8);
    this.data.writeBigUInt64LE(uLong, this.bytesWritten);
    this.bytesWritten += 8;
    return this;
  }
  /**
   * Writes a Buffer
   * @param {Buffer} buf A buffer
   * @return {Writer} A reference to the current Writer
   */
  write(buf) {
    for (const byte of buf) this.writeByte(byte);
    return this;
  }
  /**
   * Writes an ASCII string
   * @param {string} str A string
   * @return {Writer} A reference to the current Writer
   */
  ascii(str) {
    this.write(Buffer.from(str, 'utf-8'));
    return this;
  }
  /**
   * Writes a null-terminated ASCII string
   * @param {string} str A string
   * @return {Writer} A reference to the current Writer
   */
  nullascii(str) {
    this.ascii(str);
    this.byte(0);
    return this;
  }
  /**
   * Writes a MapleStory ASCII string
   * @param {string} str A string
   * @return {Writer} A reference to the current Writer
   */
  mapleascii(str) {
    this.short(str.length);
    this.ascii(str);
    return this;
  }
  /**
   * Writes a position
   * @param {Point} pos A position {x, y}
   * @return {Writer} A reference to the current Writer
   */
  pos(pos) {
    this.short(pos.x);
    this.short(pos.y);
    return this;
  }
  /**
   * Writes a boolean value
   * @param {boolean} bool A boolean
   * @return {Writer} A reference to the current Writer
   */
  bool(bool) {
    this.byte(bool ? 1 : 0);
    return this;
  }
  /**
   * Returns the packet Buffer
   * @return {Buffer} The output Buffer
   */
  buffer() {
    return this.data;
  }
}
module.exports = Writer;
