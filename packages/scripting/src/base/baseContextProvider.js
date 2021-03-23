/**
 * The generic context provider
 * @interface
 * @memberof module:@perion/scripting
 */
class BaseContextProvider {
  constructor() {}
  /**
   * Base getContext method
   * @param {*} request 
   * @return {string}
   */
  getContext(request) {
    return 'BaseContextProvider not implemented';
  }
}
module.exports = BaseContextProvider;