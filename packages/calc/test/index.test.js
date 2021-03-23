const assert = require('assert');
const calc = require('../index.js');
describe('@perion/calc module exports', function() {
  it('should export calc.HyperStats', function() {
    assert('HyperStats' in calc);
  });
});