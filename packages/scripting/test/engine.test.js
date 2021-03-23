const assert = require('assert');
const scripting = require('../index.js');
describe('@perion/scripting.Engine', function() {
  it('should handle request from default script and context providers', function() {
    const scriptProvider = new scripting.ScriptProvider();
    const contextProvider = new scripting.ContextProvider();
    const engine = new scripting.Engine(scriptProvider, contextProvider);
    engine.handleRequest({id: '0', type: 'npc'}).then(res => {
      assert(res === true);
    }).catch(err => {
      console.log(err);
      assert(err === null || err === undefined);
    });
  });
  it('should throw errors', function() {
    const scriptProvider = new scripting.ScriptProvider();
    const contextProvider = new scripting.ContextProvider();
    const engine = new scripting.Engine(scriptProvider, contextProvider);
    engine.handleRequest({id: '0', type: 'unknown'}).catch(err => {
      assert(err !== null && err !== undefined);
    });
    engine.handleRequest({id: 'broken', type: 'npc'}).catch(err => {
      assert(err !== null && err !== undefined);
    });
  });
});