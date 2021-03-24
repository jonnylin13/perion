const assert = require('assert');
const wz = require('../index.js');
describe('@perion/wz module exports', function() {
  it('should export wz.AES', function() {
    assert('AES' in wz);
  });
});