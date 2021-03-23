class Engine {
  constructor(scriptProvider, contextProvider) {
    this.scriptProvider = scriptProvider;
    this.contextProvider = contextProvider;
  }
  static evalInContext(js, context) {
    return new Promise(resolve => {
      resolve(function() {return eval(js);}.call(context));
    });
  }
  handleRequest(request) {
    return new Promise(resolve => {
       // Parse the request
      const parsedRequest = request;
      const script = this.scriptProvider.getScript(parsedRequest);
      const context = this.contextProvider.getContext(parsedRequest);
      Engine.evalInContext(script, context).then(res => {
        resolve(true);
      }).catch(err => {
        resolve(false);
      });
    });
  }
}
module.exports = Engine;