const assert = require('assert');
const {ADDED_STATS} = require('../src/constants.js');
describe('@perion/calc/src/constants.js internal only', function() {
  it('should return the v83 added stats constants', function() {
    const constants = ADDED_STATS(83);
    assert.ok('HYPER' in constants);
  });
});