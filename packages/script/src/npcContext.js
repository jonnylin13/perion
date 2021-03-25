const BaseContext = require('./base/baseContext');
/**
 * A class that takes a StateContainer and builds a context that
 * script.Engine uses to evaluate.
 * @class
 * @memberof module:@perion/script
 */
class NPCContext extends BaseContext {
  /**
   * Returns an instance of NPCContext
   * @constructor
   * @param {StateContainer} stateContainer 
   */
  constructor(stateContainer) {
    super(stateContainer, 'npc');
  }
  /**
   * Returns a context that an NPC script can bind to
   * @return {Object} The context object
   */
  build() {
    return {
      stateContainer: this.stateContainer,
      test: () => true
    };
  }
}
module.exports = NPCContext;