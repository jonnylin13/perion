/**
 * Allows you to cast integers to ensure their type
 * @class
 * @memberof module:@perion/core
 */
class Cast {
  /**
   * Cast class constructor
   * @constructor
   * @param {number} val The value to cast
   */
  constructor(val) {
    this.val = val;
  }
  /**
   * Creates a Cast Object
   * @static
   * @param {number} val 
   * @return {Cast}
   */
  static from(val) {
    return new Cast(val);
  }
  /**
   * @return {number}
   */
  int8() {
    return Int8Array.from([this.val])[0];
  }
  /**
   * @return {number}
   */
  uint8() {
    return Uint8Array.from([this.val])[0];
  }
  /**
   * @return {number}
   */
  int16() {
    return Int16Array.from([this.val])[0];
  }
  /**
   * Returns a uint16
   * @return {number}
   */
  uint16() {
    return Uint16Array.from([this.val])[0];
  }
  /**
   * Returns a short
   * @return {number}
   */
  short() {
    return Int16Array.from([this.val])[0];
  }
  /**
   * Returns a ushort
   * @return {number}
   */
  ushort() {
    return Uint16Array.from([this.val])[0];
  }
  /**
   * Returns an int32
   * @return {number}
   */
  int32() {
    return Int32Array.from([this.val])[0];
  }
  /**
   * Returns a uint32
   * @return {number}
   */
  uint32() {
    return Uint32Array.from([this.val])[0];
  }
  /**
   * Returns an int64
   * @return {bigint}
   */
  int64() {
    return BigInt(this.val);
  }
  /**
   * Returns a float32
   * @return {number}
   */
  float32() {
    return Float32Array.from([this.val])[0];
  }
  /**
   * Returns a float64
   * @return {number}
   */
  float64() {
    return Float64Array.from([this.val])[0];
  }
}
module.exports = {Cast};
