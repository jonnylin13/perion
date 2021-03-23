const BaseContextProvider = require('./base/baseContextProvider.js');
class ContextProvider extends BaseContextProvider {
  constructor() {
    super();
  }
  getContext(request) {
    return {request, test: () => console.log('This is a context function!')};
  }
}
module.exports = ContextProvider;