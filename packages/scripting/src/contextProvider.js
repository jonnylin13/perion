const BaseContextProvider = require('./base/baseContextProvider.js');
class ContextProvider extends BaseContextProvider {
  constructor() {
    super();
  }
  getContext(request) {
    return {request, test: () => { return true; }};
  }
}
module.exports = ContextProvider;