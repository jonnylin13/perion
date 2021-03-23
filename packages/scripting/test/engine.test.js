const assert = require('assert');
const scripting = require('../index.js');
describe('@perion/scripting.Engine', function() {
  it('should handle request from default script and context providers', function() {
    const scriptProvider = new scripting.ScriptProvider();
    const contextProvider = new scripting.ContextProvider();
    const engine = new scripting.Engine(scriptProvider, contextProvider);
    engine.handleRequest('test').then(res => {
    })
  });
});