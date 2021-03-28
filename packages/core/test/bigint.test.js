const assert = require('assert');
require('../src/mixins/bigint');
describe('@perion/core mixins', function() {
  it('should test BigInt.prototype.toString()', function() {
    assert(BigInt(2).toJSON() === 'bigint;2n');
    console.log(BigInt(2).toJSON());
  });
});