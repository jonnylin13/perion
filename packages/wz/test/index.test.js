const assert = require('assert');
const wz = require('../index.js');
describe('@perion/wz module exports', function() {
  it('should export wz.WZAES', function() {
    assert('WZAES' in wz);
  });
});