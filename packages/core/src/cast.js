/**
 * Allows you to cast integers to ensure their type
 * @param {number} val 
 * @return {number}
 */
function cast(val) {
  return {
    /**
     * @return {number}
     */
    int8: () => {
      return Int8Array.from([val])[0];
    },
    /**
     * @return {number}
     */
    uint8: () => {
      return Uint8Array.from([val])[0];
    },
    /**
     * @return {number}
     */
    int16: () => {
      return Int16Array.from([val])[0];
    },
    /**
     * @return {number}
     */
    uint16: () => {
      return Uint16Array.from([val])[0];
    },
    /**
     * @return {number}
     */
    short: () => {
      return Int16Array.from([val])[0];
    },
    /**
     * @return {number}
     */
    ushort: () => {
      return Uint16Array.from([val])[0];
    },
    /**
     * @return {number}
     */
    int32: () => {
      return Int32Array.from([val])[0];
    },
    /**
     * @return {number}
     */
    uint32: () => {
      return Uint32Array.from([val])[0];
    },
    /**
     * @return {number}
     */
    int64: () => {
      return BigInt64Array.from([val])[0];
    },
    /**
     * @return {number}
     */
    float32: () => {
      return Float32Array.from([val])[0];
    },
    /**
     * @return {number}
     */
    float64: () => {
      return Float64Array.from([val])[0];
    }
  };
}
module.exports = {cast};
