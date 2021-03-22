const assert = require('assert');
const Stats = require('../index.js').Stats;
describe('@titan/calc.Stats', function() {
  it('should apply pure stat modifiers', function() {
    const base = {str: 4, dex: 4, luk: 4, int: 4};
    const hyper = {str: 1, dex: 2, luk: 10, int: 10};
    const playerStats = {base, hyper};
    const calculated = (new Stats(playerStats)).applyHyperPureStats();
    assert(calculated.modified.str, 30 * hyper.str + base.str);
  });
});