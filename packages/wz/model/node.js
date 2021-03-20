/**
 * Represents a Node in the WZ directory structure
 * @class
 */
class Node {
  /**
   * @constructor
   * @param {Node} parent 
   * @param {string} name 
   * @param {string} cachedPath 
   * @param {boolean} hasCachedPath 
   */
  constructor(parent, name, cachedPath, hasCachedPath) {
    this.parent = parent;
    this.name = name;
    this.cachedPath = cachedPath;
    this.hasCachedPath = hasCachedPath;
  }
  /**
   * Returns the cached path if exists
   * @return {string}
   */
  getPath() {
    if (!this.hasCachedPath) {
      let x = this;
      let buffer = '';
      while (x !== null && x !== undefined) {
        buffer = `/${x.name}${buffer}`;
        x = x.parent;
      }
      this.cachedPath = buffer.slice(1);
      this.hasCachedPath = true;
    }
    return this.cachedPath;
  }
}