const BaseScriptProvider = require('./base/baseScriptProvider.js');
const fs = require('fs');
/**
 * A class used for provisioning script files
 * @class
 * @memberof module:@perion/script
 */
class ScriptProvider extends BaseScriptProvider {
  /**
   * Returns a new instance of ScriptProvider
   * @constructor
   * @param {string} rootDir The root scripts directory
   */
  constructor(rootDir='/scripts/') {
    super();
    this.rootDir = rootDir;
  }
  /**
   * Retrieves the requested script file (internal)
   * @param {string} id The file identifier (name)
   * @param {string} type The type of script
   * @return {string} The JS file as a string
   * @throws {Error}
   */
  getFile(id, type) {
    return new Promise((resolve, reject) => {
      const fileDir = this.rootDir + `/${type}/${id}.js`;
      fs.readFile(__dirname + fileDir, (err, data) => {
        if (err) reject(err);
        else resolve(data.toString('utf-8'));
      });
    });
  }
  /**
   * Retrieves the requested script file
   * @param {string} request
   * @return {string} The JS file as a string
   * @throws {Error}
   */
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