/**
 * Base context interface
 * @interface
 * @memberof module:@perion/script
 */
class BaseContext {
  /**
   * Instantiates a new Context
   * @param {StateContainer} state 
   * @param {string} type 
   */
  constructor(state, type) {
    this.state = state;
    this.type = type;
  }
  /**
   * Base build method
   * @return {Object}
   */
  build() {
    return {};
  }
}
module.exports = BaseContext;