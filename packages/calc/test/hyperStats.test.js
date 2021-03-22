const assert = require('assert');
const HyperStats = require('../index.js').HyperStats;
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
  it('should apply hp and mp stat modifiers', function() {
    const base = {maxHp: 1000000, maxMp: 1000000};
    const hyper = {maxHp: 1, maxMp: 3};
    const player = {stats: {base, hyper}};
    const calculated = HyperStats(player.stats).applyMaxHp().applyMaxMp().get();
    base.maxHp += 20000;
    base.maxMp += 60000;
    assert.deepEqual(base, calculated);
  });
  it('should apply demon force and time force stat modifiers', function() {
    const base = {maxDF: 100, maxTF: 100};
    const hyper = {maxDF: 1, maxTF: 10};
    const player = {stats: {base, hyper}};
    const calculated = HyperStats(player.stats).applyMaxDF().applyMaxTF().get();
    const expected = {maxDF: 110, maxTF: 200};
    assert.deepEqual(expected, calculated);
  });
});