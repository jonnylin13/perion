class Params {
  static parse(str) {
    if (str.split('?').length === 1) return {};
    const params = str.split('?')[1].split('&');
    const obj = {};
    for (const param of params) {
      const split = param.split('=');
      if (split.length === 1) throw new Error('Invalid params string');
      const field = split[0];
      const value = split[1];
      obj[field] = value;
    }
    return obj;
  }
}
module.exports = Params;