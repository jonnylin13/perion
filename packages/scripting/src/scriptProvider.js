const BaseScriptProvider = require('./base/baseScriptProvider.js');
class ScriptProvider extends BaseScriptProvider {
  constructor(rootDir='/scripts/') {
    super();
    this.rootDir = rootDir;
  }
  getScript(request) {
    return 'this.test();';
  }
}
module.exports = ScriptProvider;