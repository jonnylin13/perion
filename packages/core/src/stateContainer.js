require('./mixins/bigint');
const MAX_EXPIRATION = 2592000;
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
  set(key, value, cache=null) {
    return new Promise((resolve, reject) => {
      if (!cache) {
        this.state[key] = value;
        resolve(this.state[key]);
        return;
      }
      cache.set(key, JSON.stringify(value), MAX_EXPIRATION, (err) => {
        if (err) {
          reject(err);
          return;
        }
        this.state[key] = value;
        resolve(this.state[key]);
      });
    });
  }
  /**
   * Deletes a key, value pair
   * @param {*} key 
   * @return {*} Returns the value
   */
  delete(key, cache=null) {
    return new Promise((resolve, reject) => {
      const value = this.state[key];
      if (!cache) {
        delete this.state[key];
        resolve(true);
        return;
      }
      cache.del(key, (err) => {
        if (err) {
          reject(err);
          return;
        }
        delete this.state[key];
        resolve(true);
      });
    });
  }
  /**
   * Fetches a value from a key
   * @param {*} key 
   * @return {*} Returns the removed object
   */
  get(key, cache=null) {
    return new Promise((resolve, reject) => {
      if (!cache) {
        resolve(this.state[key]);
        return;
      }
      cache.get(key, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          const unpacked = StateContainer.unpack(data);
          resolve(unpacked);
        } catch (err) {
          reject(err);
        }
      });
    });
  }
  /**
   * Serializes a StateContainer into a Buffer
   * @return {Buffer}
   */
  pack(key=null) {
    return new Promise((resolve, reject) => {
      if (key) {
        if (!this.state[key]) {
          reject(new Error(`Key ${key} does not exist`));
          return;
        }
        const obj = JSON.stringify(this.state[key]);
        resolve(obj);
        return;
      }
      resolve(Buffer.from(JSON.stringify(this.state)));
    });
  }
  /**
   * Deserializes a field value
   * @param {Buffer} data 
   * @returns 
   */
  static unpack(data) {
    try {
      const parsed = JSON.parse(data.toString('utf-8'));
      return StateContainer._checkBigInt(parsed);
    } catch (err) {
      throw err;
    }
  }
}
module.exports = StateContainer;
