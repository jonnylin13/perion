const assert = require('assert');
const HyperStats = require('../index.js').HyperStats;
const Util = require('../src/hyperStats.js').Util;
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
  it('should apply crit and crit dmg modifiers', function() {
    const base1 = {crit: 5, critDmg: 5};
    const base2 = {crit: 5, critDmg: 5};
    const hyper1 = {crit: 1, critDmg: 15};
    const hyper2 = {crit: 3, critDmg: 6};
    const player1 = {stats: {hyper: hyper1, base: base1}};
    const player2 = {stats: {hyper: hyper2, base: base2}};
    const calc1 = HyperStats.from(player1.stats).applyCrit().applyCritDmg().get();
    const calc2 = HyperStats.from(player2.stats).applyCrit().applyCritDmg().get();
    assert.deepEqual(calc1, {crit: 6, critDmg: 20});
    assert.deepEqual(calc2, {crit: 8, critDmg: 11});
  });
  it('should apply ignore def % modifier', function() {
    let base = {ignoreDef: 10};
    let hyper = {ignoreDef: 10};
    const player = {stats: {base, hyper}};
    const calc = HyperStats.from(player.stats).applyIgnoreDef().get();
    assert.deepEqual(calc, {ignoreDef: 40});
  });
  it('should apply boss dmg modifier', function() {
    let base = {bossDmg: 30};
    let hyper = {bossDmg: 1};
    const calc = HyperStats.from({base, hyper}).applyBossDmg().get();
    assert.deepEqual(calc, {bossDmg: 33});
  });
  it('should apply dmg modifier', function() {
    let base = {dmg: 10};
    let hyper = {dmg: 1};
    const calc = HyperStats.from({base, hyper}).applyDmg().get();
    assert.deepEqual(calc, {dmg: 13});
  });
  it('should apply status resist modifier', function() {
    let base = {statusResist: 10};
    let hyper = {statusResist: 1};
    const calc = HyperStats.from({base, hyper}).applyStatusResist().get();
    assert.deepEqual(calc, {statusResist: 11});
  });
  it('should apply stance modifier', function() {
    let base = {stance: 10};
    let hyper = {stance: 1};
    const calc = HyperStats.from({base, hyper}).applyStance().get();
    assert.deepEqual(calc, {stance: 12});
  });
  it('should apply weapon/magic att modifiers', function() {
    let base = {weaponAtt: 10, magicAtt: 10};
    let hyper = {weaponAtt: 1, magicAtt: 5};
    let calc = HyperStats.from({base, hyper}).applyWeaponAtt();
    calc = calc.applyMagicAtt().get();
    assert.deepEqual(calc, {weaponAtt: 13, magicAtt: 25});
  });
  it('should apply bonus exp modifier', function() {
    let base = {bonusExp: 10};
    let hyper = {bonusExp: 1};
    let calc = HyperStats.from({base, hyper}).applyBonusExp().get();
    assert.deepEqual(calc, {bonusExp: 10.5});
  });
  it('should apply arcane force modifier', function() {
    let base = {arcaneForce: 50};
    let hyper = {arcaneForce: 1};
    let calc = HyperStats.from({base, hyper}).applyArcaneForce().get();
    assert.deepEqual(calc, {arcaneForce: 55});
  });
  it('should apply all modifiers', function() {
    let base = {
      arcaneForce: 50,
      bonusExp: 30,
      crit: 60,
      critDmg: 50,
      maxDF: 300,
      maxTF: 300,
      dmg: 18,
      ignoreDef: 80,
      maxHP: 80000,
      maxMP: 30000,
      str: 1584,
      dex: 4,
      luk: 4,
      int: 4,
      stance: 50,
      statusResist: 200,
      weaponAtt: 200,
      magicAtt: 0
    };
    let hyper = {
      arcaneForce: 0,
      bonusExp: 0,
      crit: 10,
      critDmg: 15,
      maxDF: 0,
      maxTF: 0,
      dmg: 10,
      ignoreDef: 80,
      maxHP: 0,
      maxMP: 0,
      str: 10,
      dex: 0,
      luk: 0,
      int: 0,
      stance: 0,
      statusResist: 0,
      weaponAtt: 8,
      magicAtt: 0
    };
    const calc = HyperStats.from({base, hyper}).applyAll().get();
    let result = {
      arcaneForce: 50,
      bonusExp: 30,
      crit: 75,
      critDmg: 65,
      maxDF: 300,
      maxTF: 300,
      dmg: 48,
      ignoreDef: 320,
      maxHP: 80000,
      maxMP: 30000,
      str: 1884,
      dex: 4,
      luk: 4,
      int: 4,
      stance: 50,
      statusResist: 200,
      weaponAtt: 224,
      magicAtt: 0
    };
    assert.deepEqual(result, calc);
  });
});
describe('@perion/calc.Util internal only', function() {
  it('should calc pure stat modifiers', function() {
    const hyper = {str: 1, dex: 5, luk: 10, int: 0};
    const str = Util.calcPureStat({hyper}, 'str');
    const dex = Util.calcPureStat({hyper}, 'dex');
    const luk = Util.calcPureStat({hyper}, 'luk');
    const int = Util.calcPureStat({hyper}, 'int');
    assert.strictEqual(str, 30);
    assert.strictEqual(dex, 150);
    assert.strictEqual(luk, 300);
    assert.strictEqual(int, 0);
  });
  it('should calc hp and mp stat modifiers', function() {
    const stats = {
      base: {maxHP: 10000, maxMP: 10000}, 
      hyper: {maxHP: 1, maxMP: 10}
    };
    const hp = Util.calcMaxHP(stats);
    const mp = Util.calcMaxMP(stats);
    assert.strictEqual(hp, 200);
    assert.strictEqual(mp, 2000);
  });
  it('should calc demon force and time force modifiers', function() {
    const base = {maxDF: 100, maxTF: 100};
    const hyper = {maxDF: 1, maxTF: 10};
    const df = Util.calcMaxDF({base, hyper});
    const tf = Util.calcMaxTF({base, hyper});
    assert.strictEqual(df, 10);
    assert.strictEqual(tf, 100);
  });
  it('should calc crit and crit dmg % modifiers', function() {
    const hyper = {crit: 1, critDmg: 10};
    let crit = Util.calcCrit({hyper});
    const critDmg = Util.calcCritDmg({hyper});
    assert.strictEqual(crit, 1);
    assert.strictEqual(critDmg, 10);
    hyper.crit = 7;
    crit = Util.calcCrit({hyper});
    assert.strictEqual(crit, 9);
  });
  it('should calc ignore def % modifier', function() {
    const hyper = {ignoreDef: 10};
    const ignoreDef = Util.calcIgnoreDef({hyper});
    assert.strictEqual(ignoreDef, 30);
  });
  it('should calc dmg modifier', function() {
    const hyper = {dmg: 1};
    assert.strictEqual(Util.calcDmg({hyper}), 3);
  });
  it('should calc status resist modifier', function() {
    const hyper = {statusResist: 5};
    assert.strictEqual(Util.calcStatusResist({hyper}), 5);
    hyper.statusResist = 10;
    assert.strictEqual(Util.calcStatusResist({hyper}), 15);
  });
  it('should calc stance modifier', function() {
    const hyper = {stance: 2};
    assert.strictEqual(Util.calcStance({hyper}), 4);
  });
  it('should calc weapon and magic att modifier', function() {
    const hyper = {weaponAtt: 1, magicAtt: 0};
    assert.strictEqual(Util.calcWeaponAtt({hyper}), 3);
    assert.strictEqual(Util.calcMagicAtt({hyper}), 0);
  });
  it('should calc boss dmg % modifier', function() {
    const hyper = {bossDmg: 15};
    const bossDmg = Util.calcBossDmg({hyper});
    assert.strictEqual(bossDmg, 55);
    hyper.bossDmg = 5;
    assert.strictEqual(Util.calcBossDmg({hyper}), 15);
  });
  it('should calc bonus exp modifier', function() {
    const hyper = {bonusExp: 10};
    assert.strictEqual(Util.calcBonusExp({hyper}), 5);
    hyper.bonusExp = 15;
    assert.strictEqual(Util.calcBonusExp({hyper}), 10);
  });
  it('should calc arcane force modifier', function() {
    const hyper = {arcaneForce: 10};
    assert.strictEqual(Util.calcArcaneForce({hyper}), 50);
    hyper.arcaneForce = 15;
    assert.strictEqual(Util.calcArcaneForce({hyper}), 100);
  });
});