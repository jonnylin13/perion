const assert = require('assert');
const HyperStats = require('../index.js').HyperStats;
describe('@perion/calc.HyperStats', function() {
  it('should apply pure stat modifiers', function() {
    const base = {str: 4, dex: 4, luk: 4, int: 4};
    const hyper = {str: 1, dex: 2, luk: 10, int: 10};
    const playerStats = {base, hyper};
    const calculated = HyperStats.from(playerStats).applyPureStats().get();
    assert(calculated.str, 34);
    assert(calculated.dex, 64);
    assert(calculated.luk, 304);
    assert(calculated.int, 304);
  });
  it('should apply hp and mp stat modifiers', function() {
    const base = {maxHP: 1000000, maxMP: 1000000};
    const hyper = {maxHP: 1, maxMP: 3};
    const player = {stats: {base, hyper}};
    const calculated = HyperStats.from(player.stats).applyMaxHP().applyMaxMP().get();
    base.maxHP += 20000;
    base.maxMP += 60000;
    assert.deepEqual(base, calculated);
  });
  it('should apply demon force and time force stat modifiers', function() {
    const base = {maxDF: 100, maxTF: 100};
    const hyper = {maxDF: 1, maxTF: 10};
    const player = {stats: {base, hyper}};
    const calculated = HyperStats.from(player.stats).applyMaxDF().applyMaxTF().get();
    const expected = {maxDF: 110, maxTF: 200};
    assert.deepEqual(expected, calculated);
  });
});