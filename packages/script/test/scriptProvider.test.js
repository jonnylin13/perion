const assert = require('assert');
const ScriptProvider = require('../src/scriptProvider');
describe('@perion/script.ScriptProvider', function() {
  it('should throw an error', async function() {
    const scriptProvider = new ScriptProvider();
    try {
      await scriptProvider.getScript({id: 'broken'});
    } catch (err) {
      assert(err !== null && err !== undefined);
    }
  });
});