const net = require('@perion/net');
const core = require('@perion/core');
const {OFFSET_CONSTANT} = require('../crypto/constants.js');
const {rotl} = require('../crypto/aes.js');
class FileParser extends net.Packet.Parser {
  constructor(data) {
    super(data);
    this.fileBegin = 0;
    this.file = {hash: 0};
    this.encryption = null;
  }
  wzString(uol) {
    const size = this.byte().get();
    let ascii = false;
    if (size > 0) {
      if (size === 127) size = this.int().get();
      size *= 2;
    } else {
      if (size === -128) size = this.int().get();
      size *= -1;
      ascii = true;
    }
    if (size === 0) this.parsed.push('');
    if (!ascii) {
      const mask = 0xaaaa;
      const chars = this.read(size).get();
      for (let i = 0; i < size; i += 2) {
        const char = chars[i] | (chars[i+1] << 8);
        char ^= mask;
        chars[i] = core.Cast(char).int8();
        chars[i+1] = core.Cast(char >> 8).int();
        mask++;
      }
      if (this.aes !== null && this.aes.isEncrypted(uol)) {
        this.aes.transform(chars);
      }
      this.parsed.push(chars.toString('utf-8'));
      return this;
    }
    this.ascii(size);
    return this;

  }
  wzInt() {
    let possibleSize = this.byte().get();
    if (possibleSize === -128) {
      this.int();
    } else {
      this.parsed.push(Number(possibleSize));
    }
    return this;
  }
  wzLong() {
    let possibleSize = this.byte().get();
    if (possibleSize === -128) {
      this.long();
    } else {
      this.parsed.push(BigInt(possibleSize));
    }
    return this;
  }
  wzOffset() {
    let offset = core.Cast(this.offset).uint32();
    offset = (offset - fileBegin) ^ 0xffff;
    offset *= this.file.hash;
    offset -= OFFSET_CONSTANT;
    offset = rotl(offset, offset & 0x1F);
    const encOffset = this.int().get();
    offset ^= encOffset;
    offset += this.fileBegin * 2;
    this.parsed.push(offset);
    return this;
  }
  deduplicatedWzString(uol, offset=0, addOffset=false) {
    const key = this.byte().get();
    let str = '';
    switch (key) {
      case 0:
      case 0x73:
        str = this.wzString(uol).get();
        break;
      case 1:
      case 0x1B:
        const savePoint = JSON.parse(JSON.stringify(this.offset));
        let tmp = offset;
        if (addOffset) tmp += this.uint().get();
        else tmp -= this.uint().get();
        this.seek(tmp);
        str = this.wzString(uol);
        this.seek(savePoint);
        break;
      default:
        throw new Error(`Unknown deduplicated wz string type ${key}`);
    }
    this.parsed.push(str);
    return this;
  }
  wzObjectUOL(uol, offset=0) {
    const key = this.byte().get();
    const str = ''
    switch (key) {
      case 0:
      case 0x73:
        str = this.wzString(uol).get();
        break;
      case 1:
      case 0x1B:
        offset += this.uint().get();
        const savePoint = JSON.parse(JSON.stringify(this.offset));
        this.seek(offset);
        str = this.wzString(uol).get();
        this.seek(savePoint);
        break;
      default:
        throw new Error(`Unknown deduplicated wz string type ${key}`);
    }
    this.parsed.push(str);
    return this;
  }
}
module.exports = FileParser;