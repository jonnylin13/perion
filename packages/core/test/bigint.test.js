const assert = require('assert');
require('../src/mixin/bigint');
describe('@perion/core.BigInt mixin internal only', function() {
  it('should be stringifyable', function() {
    assert.strictEqual(JSON.stringify(BigInt(2)), '"bigint;2n"');
  });
});