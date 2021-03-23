const assert = require('assert');
const ContextProvider = require('../src/contextProvider');
const contextProvider = new ContextProvider();
describe('@perion/scripting.ContextProvider', function() {
  it('should return an NPCContext', function() {
    const npcContext = contextProvider.getContext({type: 'npc'});
    assert(npcContext !== null);
    assert(npcContext.type === 'npc');
  });
  it('should throw errors', function() {
    try {
      let nullContext = contextProvider.getContext(null);
      assert(nullContext === null);
    } catch (err) {
      assert(err !== null && err !== undefined);
    }
    try {
      const unimplemented = [
        'event', 'item', 'map', 'portal', 'quest', 'reactor'
      ];
      for (const type of unimplemented ) {
        let nullContext = contextProvider.getContext({type: type});
        assert(nullContext === null);
      }
    } catch (err) {
      assert(err !== null && err !== undefined);
    }
  });
});