const net = require('@perion/net');
const Parser = net.Packet.Parser;
class WZParser extends Parser {
  constructor(data, aes, versionHash) {
    super(data);
    this.aes = aes;
    this.versionHash = versionHash;
  }
  clone() {
    const cloned = new WZParser(this.data, this.aes, this.versionHash);
    Object.assign(cloned, this);
    return cloned;
  }
  peekFor(action) {
    const oldOffset = JSON.parse(JSON.stringify(this.offset));
    try {
      action();
    } finally {
      this.offset = oldOffset;
    }
  }
  wzString(encrypted=true) {
    let length = this.byte().get();
    if (length === 0) return '';
    if (length > 0) {
      let length = length === 127 ? this.int().get() : length;
      if (length === 0) return '';
      const readBytes = this.read(length * 2).get();
      const decrypted = this.aes.transform(readBytes);
      
      return this.aes.transform(readBytes, encrypted);
    }
    length = length === -128 ? this.int().get() : -length;
    const readBytes = this.read(length).get();
    return length === 0 ? '' : this.aes.transform(readBytes, encrypted);
  }
}
module.exports = WZParser;