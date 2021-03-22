const assert = require('assert');
const HyperStats = require('../../index.js').HyperStats;
describe('@titan/calc.HyperStats', function() {
  it('should apply pure stat modifiers', function() {
    const base = {str: 4, dex: 4, luk: 4, int: 4};
    const hyper = {str: 1, dex: 2, luk: 10, int: 10};
    const playerStats = {base, hyper};
    const calculated = HyperStats(playerStats).applyPureStats().get();
    assert(calculated.str, 34);
    assert(calculated.dex, 64);
    assert(calculated.luk, 304);
    assert(calculated.int, 304);
  });
});