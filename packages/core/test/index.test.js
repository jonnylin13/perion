const assert = require('assert');
const core = require('../index.js');
describe('@perion/core module exports', function() {
  it('should export core.Cast', function() {
    assert('Cast' in core);
  });
  it('should export core.StateContainer', function() {
    assert('StateContainer' in core);
  });
});