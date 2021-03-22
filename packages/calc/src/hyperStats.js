const {ADDED_STATS, PURE_STATS} = require('./constants.js');
/** Should we be using pre-computed tables? */
class Util {
  /**
   * Calculates hyper pure stat modifier
   * @function calcPureStat
   * @static
   * @param {HyperStats} scope
   * @param {string} stat
   * @return {number}
   */
  static calcPureStat(scope, stat) {
    return scope.hyper[stat] * 30;
  }
  /**
   * Calculates the Max HP hyper stat modifier
   * @function calcMaxHp
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcMaxHp(scope) {
    return scope.base.maxHp * scope.hyper.maxHp * 0.02;
  }
  /**
   * Calculates the Max MP hyper stat modifier
   * @function calcMaxMp
   * @static
   * @param {HyperStats} scope 
   * @return {number}
   */
  static calcMaxMp(scope) {
    return scope.base.maxMp * scope.hyper.maxMp * 0.02;
  }
  /**
   * Calculates the demon force hyper stat modifier
   * @function calcMaxDF
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcMaxDF(scope) {
    return scope.hyper.maxDF * 10;
  }
  /**
   * Calculates the time force hyper stat modifier
   * @function calcMaxTF
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcMaxTF(scope) {
    return scope.hyper.maxTF * 10;
  }
  /**
   * Calculates the hyper critical rate % stat modifier
   * @function calcCrit
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcCrit(scope) {
    if (scope.hyper.crit < 6) return scope.hyper.crit;
    return 5 + (scope.hyper.crit - 5) * 2;
  }
  /**
   * Calculates the critical damage % hyper stat modifier
   * @function calcCritDmg
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcCritDmg(scope) {
    return scope.hyper.critDmg;
  }
  /**
   * Calculates the ignore defense % hyper stat modifier
   * @function calcIgnoreDef
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcIgnoreDef(scope) {
    return scope.hyper.ignoreDef * 3;
  }
  /**
   * Calculates the boss dmg % hyper stat modifier
   * @function calcBossDmg
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcBossDmg(scope) {
    if (scope.hyper.bossDmg < 6) return scope.hyper.bossDmg * 3;
    return 15 + ((scope.hyper.bossDmg - 5) * 4);
  }
  /**
   * Calculates the dmg % hyper stat modifier
   * @function calcDmg
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcDmg(scope) {
    return scope.hyper.dmg * 3;
  }
  /**
   * Calculates the status resistance hyper stat modifier
   * @function calcStatusResist
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcStatusResist(scope) {
    if (scope.hyper.statusResist < 6) return scope.hyper.statusResist;
    return 5 + ((scope.hyper.statusResist - 5) * 2);
  }
  /**
   * Calculates the stance hyper stat modifier
   * @function calcStance
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcStance(scope) {
    return scope.hyper.stance * 2;
  }
  /**
   * Calculates the weapon ATT hyper stat modifier
   * @function calcWeaponAtt
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcWeaponAtt(scope) {
    return scope.hyper.weaponAtt * 3;
  }
  /**
   * Calculates the magic ATT hyper stat modifier
   * @function calcMagicAtt
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcMagicAtt(scope) {
    return scope.hyper.magicAtt * 3;
  }
  /**
   * Calculates the bonus EXP % hyper stat modifier
   * @function calcBonusExp
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcBonusExp(scope) {
    if (scope.hyper.bonusExp < 11) return 0.5 * scope.hyper.bonusExp;
    return scope.hyper.bonusExp - 5;
  }
  /**
   * Calculates the arcane force hyper stat modifier
   * @function calcArcaneForce
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcArcaneForce(scope) {
    if (scope.hyper.arcaneForce < 11) return scope.hyper.arcaneForce * 5;
    else 50 + (scope.hyper.arcaneForce - 10) * 10;
  }
}
/**
 * Provides hyper stat calculations for MapleStory characters
 * @function
 * @param {Object} playerStats
 */
function HyperStats({base, hyper}) {
  const scope = Object.assign({}, {base, hyper});
  scope.modified = {};
  /**
   * Applies the hyper pure stat modifiers
   * @method applyPureStats
   * @return {HyperStats}
   */
  scope.applyPureStats = () => {
    for (const name of PURE_STATS) {
      const addition = Util.calcPureStat(scope, name);
      scope.modified[name] = scope.base[name] + addition;
    }
    return scope;
  };
  /**
   * Applies the Max HP hyper stat modifier
   * @method applyMaxHp
   * @return {HyperStats}
   */
  scope.applyMaxHp = () => {
    const addition = Util.calcMaxHp(scope);
    scope.modified.maxHp = scope.base.maxHp + addition;
    return scope;
  };
  /**
   * Applies the Max MP hyper stat modifier
   * @method applyMaxMp
   * @return {HyperStats}
   */
  scope.applyMaxMp = () => {
    const addition = Util.calcMaxMp(scope);
    scope.modified.maxMp = scope.base.maxMp + addition;
    return scope;
  };
  /**
   * Applies the demon force hyper stat modifier
   * @method applyMaxDF
   * @return {HyperStats}
   */
  scope.applyMaxDF = () => {
    const addition = Util.calcMaxDF(scope);
    scope.modified.maxDF = scope.base.maxDF + addition;
    return scope;
  };
  /**
   * Applies the time force hyper stat modifiers
   * @method applyMaxTF
   * @return {HyperStats}
   */
  scope.applyMaxTF = () => {
    const addition = Util.calcMaxTF(scope);
    scope.modified.maxTF = scope.base.maxTF + addition;
    return scope;
  };
  /**
   * Applies the hyper critical rate % hyper stat modifier
   * @method applyCrit
   * @return {HyperStats}
   */
  scope.applyCrit = () => {
    const addition = Util.calcCrit(scope);
    scope.modified.crit = scope.base.crit + addition;
    return scope
  };
  /**
   * Applies the critical damage % hyper stat modifier
   * @method applyCritDmg
   * @return {HyperStats}
   */
  scope.applyCritDmg = () => {
    const addition = Util.calcCritDmg(scope);
    scope.modified.crit = scope.base.crit + addition;
    return scope;
  };
  /**
   * Applies the ignore defense % hyper stat modifier
   * @method applyIgnoreDef
   * @return {HyperStats}
   */
  scope.applyIgnoreDef = () => {
    const addition = Util.calcIgnoreDef(scope);
    scope.modified.ignoreDef = scope.base.ignoreDef + addition;
    return scope;
  };
  /**
   * Applies the boss dmg % hyper stat modifier
   * @method applyBossDmg
   * @return {HyperStats}
   */
  scope.applyBossDmg = () => {
    scope.modified.bossDmg = scope.base.bossDmg + Util.calcBossDmg(scope);
    return scope;
  };
  /**
   * Applies the dmg % hyper stat modifier
   * @method applyDmg
   * @return {HyperStats}
   */
  scope.applyDmg = () => {
    scope.modified.dmg = scope.base.dmg + Util.calcDmg(scope);
    return scope;
  };
  /**
   * Applies the status resistance hyper stat modifier
   * @method applyStatusResist
   * @return {HyperStats}
   */
  scope.applyStatusResist = () => {
    const addition = Util.calcStatusResist();
    scope.modified.statusResist = scope.base.statusResist + addition;
    return scope;
  };
  /**
   * Applies the stance hyper stat modifier
   * @method applyStance
   * @return {HyperStats}
   */
  scope.applyStance = () => {
    const addition = Util.calcStance(scope);
    scope.modified.stance = scope.base.stance + addition;
    return scope;
  };
  /**
   * Applies the weapon ATT hyper stat modifier
   * @method applyWeaponAtt
   * @return {HyperStats}
   */
  scope.applyWeaponAtt = () => {
    const addition = Util.calcWeaponAtt(scope);
    scope.modified.weaponAtt = scope.base.weaponAtt + addition;
    return scope;
  };
  /**
   * Applies the magic ATT hyper stat modifier
   * @method applyMagicAtt
   * @return {HyperStats}
   */
  scope.applyMagicAtt = () => {
    const addition = Util.calcMagicAtt(scope);
    scope.modified.magicAtt = scope.base.magicAtt + addition;
    return scope;
  };
  /**
   * Applies the bonus EXP % hyper stat modifier
   * @method applyBonusExp
   * @return {HyperStats}
   */
  scope.applyBonusExp = () => {
    const addition = Util.calcBonuxExp(scope);
    scope.modified.bonusExp = scope.base.bonusExp + addition;
    return scope;
  };
  /**
   * Applies the arcane force hyper stat modifier
   * @method applyArcaneForce
   * @return {HyperStats}
   */
  scope.applyArcaneForce = () => {
    const addition = Util.calcArcaneForce(scope);
    scope.modified.arcaneForce = scope.base.arcaneForce + addition;
  };
  /**
   * Applies all the hyper stat modifiers
   * @method applyAll
   * @return {HyperStats}
   */
  scope.applyAll = () => {
    scope.applyArcaneForce();
    scope.applyBonusExp();
    scope.applyCrit();
    scope.applyCritDmg();
    scope.applyDF();
    scope.applyTF();
    scope.applyDmg();
    scope.applyIgnoreDef();
    scope.applyMaxHp();
    scope.applyMaxMp();
    scope.applyPureStats();
    scope.applyStance();
    scope.applyStatusResist();
    scope.applyWeaponAtt();
    scope.applyMagicAtt();
    return scope;
  };
  /**
   * Gets the modified stat values
   * @method get
   * @return {Object}
   */
  scope.get = () => {
    return scope.modified;
  }
  return scope;
}
module.exports = {HyperStats};
