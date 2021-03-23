const BaseScriptProvider = require('./base/baseScriptProvider.js');
const fs = require('fs');
class ScriptProvider extends BaseScriptProvider {
  constructor(rootDir='/scripts/') {
    super();
    this.rootDir = rootDir;
  }
  getFile(id, type) {
    return new Promise((resolve, reject) => {
      const fileDir = this.rootDir + `/${type}/${id}.js`;
      fs.readFile(__dirname + fileDir, (err, data) => {
        if (err) reject(err);
        else resolve(data.toString('utf-8'));
      });
    });
  }
  getScript(request) {
    return new Promise((resolve, reject) => {
      if (!('id' in request) || !('type' in request)) {
        reject(new Error('Could not find id or type'));
        return;
      }
      this.getFile(request.id, request.type).then(res => {
        resolve(res);
      }).catch(err => reject(err));
    });
  }
}
module.exports = ScriptProvider;