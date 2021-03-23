/**
 * The generic script provider
 * @interface
 * @memberof module:@perion/script
 */
class BaseScriptProvider {
  constructor() {}
  /**
   * Base method
   * @param {*} request 
   * @return {string}
   */
  getScript(request) {
    return 'BaseScriptProvider not implemented';
  }
}
module.exports = BaseScriptProvider;