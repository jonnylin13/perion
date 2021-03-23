/**
 * The generic script provider
 * @interface
 * @memberof module:@perion/scripting
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