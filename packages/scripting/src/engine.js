class Engine {
  constructor(scriptProvider, contextProvider, options=null) {
    this.scriptProvider = scriptProvider;
    this.contextProvider = contextProvider;
    this.options = options;
  }
  static evalInContext(js, context) {
    return new Promise(resolve => {
      resolve(function() {return eval(js);}.call(context));
    });
  }
  async handleRequest(request) {
    const parsedRequest = request;
    try {
      const script = await this.scriptProvider.getScript(parsedRequest);
      const context = this.contextProvider.getContext(parsedRequest);
      if (!script || !context) {
        throw new Error('Could not resolve script or context');
      }
      const res = await Engine.evalInContext(script, context);
      if (res) return true;
      throw new Error(`Could not evaluate script ${request.id}.js in context`);
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Engine;