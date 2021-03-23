/**
 * The scripting engine that takes a script provider and context provider
 * @class
 * @memberof module:@perion/scripting
 */
class Engine {
  /**
   * Instantiates a new Engine
   * @constructor
   * @param {ScriptProvider} scriptProvider 
   * @param {ContextProvider} contextProvider 
   * @param {Object} options 
   */
  constructor(scriptProvider, contextProvider, options=null) {
    this.scriptProvider = scriptProvider;
    this.contextProvider = contextProvider;
    this.options = options;
  }
  /**
   * Evaluates a script in context
   * @static
   * @param {string} js The script to execute
   * @param {Object} context The context to apply
   * @return {boolean} The result
   * @throws {Error}
   */
  static evalInContext(js, context) {
    return new Promise((resolve, reject) => {
      try {
        resolve(function() {return eval(js);}.call(context));
      } catch (err) {
        reject(err);
      }
    });
  }
  /**
   * Handles a script execute request asynchronously
   * @param {Object} request 
   * @return {boolean} Th result
   * @throws {Error}
   */
  async handleRequest(request) {
    const parsedRequest = request;
    try {
      const script = await this.scriptProvider.getScript(parsedRequest);
      const context = this.contextProvider.getContext(parsedRequest).build();
      await Engine.evalInContext(script, context);
      return true;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Engine;