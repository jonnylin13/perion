require('./mixin/bigint.js');
/**
 * Will be a key:value store that can be serialized and sent over sockets, streams
 */
class StateContainer {
  constructor(initialState) {
    this.state = Object.assign({}, initialState);
  }
  static from(serializedState) {
    try {
      const unserialized = JSON.parse(serializedState.toString('utf-8'));
      for (const key of Object.keys(unserialized)) {
        if (typeof unserialized[key] == 'string' 
            && unserialized[key].includes('bigint;')) {
          const valueStr = unserialized[key].split('bigint;')[1];
          const m = valueStr.match(/(-?\d+)n/);
          unserialized[key] = BigInt(m[1]);
        }
      }
      return new StateContainer(unserialized);
    } catch (err) {
      throw err;
    }
  }
  set(key, value) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.state[key] = value;
        resolve(this.state[key]);
      }, 0);
    });
  }
  delete(key) {
    return new Promise(resolve => {
      setTimeout(() => {
        const value = this.state[key];
        delete this.state[key];
        resolve(this.state[key]);
      }, 0);
    });
  }
  get(key) {
    return new Promise(resolve => {
       resolve(this.state[key]);
    });
  }
  pack() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(JSON.stringify(this.state));
      }, 0);
    });
  }
}
module.exports = StateContainer;
