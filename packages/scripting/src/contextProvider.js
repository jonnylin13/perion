const BaseContext = require('./base/baseContext.js');
const BaseContextProvider = require('./base/baseContextProvider.js');
const NPCContext = require('./npcContext.js');
/**
 * Provides context to scripting.Engine
 * @class
 * @memberof module:@perion/scripting
 */
class ContextProvider extends BaseContextProvider {
  /**
   * Instantiates a new ContextProvider
   * @constructor
   */
  constructor() {
    super();
  }
  /**
   * Returns the context to be built
   * @param {Object} request The request containing file id and type
   * @return {BaseContext}
   * @throws {Error}
   */
  getContext(request) {
    if (request === null || request === undefined || !('type' in request)) {
      throw new Error('No context type provided');
    }
    switch(request.type) {
      case 'npc':
        return new NPCContext(null);
      case 'event':
      case 'item':
      case 'map':
      case 'portal':
      case 'quest':
      case 'reactor':
      default:
        throw new Error(`Could not find context type ${request.type}`);
    }
  }
}
module.exports = ContextProvider;