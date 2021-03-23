require('./mixin/bigint.js');
/**
 * A key:value state asynchronous, serializable state container.
 * Can store primitives and objects including BigInt.
 * @class
 * @memberof module:@perion/core
 */
class StateContainer {
  /**
   * Initializes the initial state by copying the provided object
   * @constructor
   * @param {Object} initialState 
   */
  constructor(initialState) {
    this.state = Object.assign({}, initialState);
  }
  /**
   * Checks for BigInts to be deserialized
   * @static
   * @private
   * @param {Object} obj 
   * @return {Object}
   */
  static _checkBigInt(obj) {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] == 'string' 
          && obj[key].includes('bigint;')) {
        const valueStr = obj[key].split('bigint;')[1];
        const m = valueStr.match(/(-?\d+)n/);
        obj[key] = BigInt(m[1]);
      } else if (typeof obj[key] == 'object') {
        if (Array.isArray(obj[key])) continue;
        obj[key] = StateContainer._checkBigInt(obj[key]);
      }
    }
    return obj;
  }
  /**
   * Static constructor from serialized state
   * @static
   * @param {Buffer} serializedState 
   * @return {StateContainer}
   */
  static from(serializedState) {
    try {
      const parsed = JSON.parse(serializedState.toString('utf-8'));
      const unserialized = StateContainer._checkBigInt(parsed);
      return new StateContainer(unserialized);
    } catch (err) {
      throw err;
    }
  }
  /**
   * Sets a key, value pair
   * @param {*} key 
   * @param {*} value 
   * @return {*} Returns the value
   */
  set(key, value) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.state[key] = value;
        resolve(this.state[key]);
      }, 0);
    });
  }
  /**
   * Deletes a key, value pair
   * @param {*} key 
   * @return {*} Returns the value
   */
  delete(key) {
    return new Promise(resolve => {
      setTimeout(() => {
        const value = this.state[key];
        delete this.state[key];
        resolve(this.state[key]);
      }, 0);
    });
  }
  /**
   * Fetches a value from a key
   * @param {*} key 
   * @return {*} Returns the removed object
   */
  get(key) {
    return new Promise(resolve => {
       resolve(this.state[key]);
    });
  }
  /**
   * Serializes a StateContainer into a Buffer
   * @return {Buffer}
   */
  pack() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Buffer.from(JSON.stringify(this.state)));
      }, 0);
    });
  }
}
module.exports = StateContainer;
