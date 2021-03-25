const BaseContext = require('./base/baseContext.js');
const BaseContextProvider = require('./base/baseContextProvider.js');
const NPCContext = require('./npcContext.js');
const {StateContainer} = require('@perion/core');
/**
 * Provides context to script.Engine
 * @class
 * @memberof module:@perion/script
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
        return new NPCContext(new StateContainer({id: request.id}));
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