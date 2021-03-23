const BaseContext = require('../src/base/baseContext.js');
const BaseContextProvider = require('../src/base/baseContextProvider.js');
const BaseScriptProvider = require('../src/base/baseScriptProvider.js');
const assert = require('assert');
describe('@perion/script BaseContext, BaseContextProvider, BaseScriptProvider', function() {
  it('should cover base tests', function() {
    const ctx = new BaseContext(null, 'npc');
    assert(Object.keys(ctx.build()).length === 0);
    const ctxProvider = new BaseContextProvider();
    assert(typeof ctxProvider.getContext() == 'string');
    const scriptProvider = new BaseScriptProvider();
    assert(typeof scriptProvider.getScript() == 'string');
  });
});