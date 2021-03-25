/**
 * Base context interface
 * @interface
 * @memberof module:@perion/script
 */
class BaseContext {
  /**
   * Instantiates a new Context
   * @param {StateContainer} stateContainer 
   * @param {string} type 
   */
  constructor(stateContainer, type) {
    this.stateContainer = stateContainer;
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