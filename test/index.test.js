const assert = require('assert');
const perion = require('../index.js');
describe('@perion/titan module exports', function() {
  it('should export crypto', function() {
    assert('crypto' in perion);
  });
  it('should export net', function() {
    assert('net' in perion);
  });
  it('should export calc', function() {
    assert('calc' in perion);
  });
  it('should export core', function() {
    assert('core' in perion);
  });
  it('should export script', function() {
    assert('script' in perion);
  });
  it('should export wz', function() {
    assert('wz' in perion);
  });
});