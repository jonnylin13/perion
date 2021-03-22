const {ADDED_STATS, PURE_STATS} = require('./constants.js');
/**
 * Internal class for calculating hyper stat modifiers
 * @class
 * @ignore
 */
class Util {
  /**
   * Calculates hyper pure stat modifier
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
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcMaxHP(scope) {
    return scope.base.maxHP * scope.hyper.maxHP * 0.02;
  }
  /**
   * Calculates the Max MP hyper stat modifier
   * @static
   * @param {HyperStats} scope 
   * @return {number}
   */
  static calcMaxMP(scope) {
    return scope.base.maxMP * scope.hyper.maxMP * 0.02;
  }
  /**
   * Calculates the demon force hyper stat modifier
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcMaxDF(scope) {
    return scope.hyper.maxDF * 10;
  }
  /**
   * Calculates the time force hyper stat modifier
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcMaxTF(scope) {
    return scope.hyper.maxTF * 10;
  }
  /**
   * Calculates the hyper critical rate % stat modifier
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
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcCritDmg(scope) {
    return scope.hyper.critDmg;
  }
  /**
   * Calculates the ignore defense % hyper stat modifier
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcIgnoreDef(scope) {
    return scope.hyper.ignoreDef * 3;
  }
  /**
   * Calculates the boss dmg % hyper stat modifier
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
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcDmg(scope) {
    return scope.hyper.dmg * 3;
  }
  /**
   * Calculates the status resistance hyper stat modifier
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
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcStance(scope) {
    return scope.hyper.stance * 2;
  }
  /**
   * Calculates the weapon ATT hyper stat modifier
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcWeaponAtt(scope) {
    return scope.hyper.weaponAtt * 3;
  }
  /**
   * Calculates the magic ATT hyper stat modifier
   * @static
   * @param {HyperStats} scope
   * @return {number}
   */
  static calcMagicAtt(scope) {
    return scope.hyper.magicAtt * 3;
  }
  /**
   * Calculates the bonus EXP % hyper stat modifier
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
 * @class
 * @memberof module:@perion/calc
 */
class HyperStats {
  /**
   * Use HyperStats.from()
   * @param {Object} playerStats An object containing the player stats
   */
  constructor({base, hyper}) {
    const cloned = Object.assign({}, {base, hyper});
    this.base = cloned.base;
    this.hyper = cloned.hyper;
    this.modified = {};
  }
  /**
   * Creates a HyperStats object
   * @param {Object} playerStats An object containing the player stats
   * @return {HyperStats} A reference to the current HyperStats object
   */
  static from({base, hyper}) {
    return new HyperStats({base, hyper});
  }
  /**
   * Applies the hyper pure stat modifiers
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyPureStats() {
    for (const name of PURE_STATS) {
      const addition = Util.calcPureStat(this, name);
      this.modified[name] = this.base[name] + addition;
    }
    return this;
  };
  /**
   * Applies the Max HP hyper stat modifier
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyMaxHP() {
    const addition = Util.calcMaxHP(this);
    this.modified.maxHP = this.base.maxHP + addition;
    return this;
  };
  /**
   * Applies the Max MP hyper stat modifier
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyMaxMP() {
    const addition = Util.calcMaxMP(this);
    this.modified.maxMP = this.base.maxMP + addition;
    return this;
  };
  /**
   * Applies the demon force hyper stat modifier
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyMaxDF() {
    const addition = Util.calcMaxDF(this);
    this.modified.maxDF = this.base.maxDF + addition;
    return this;
  };
  /**
   * Applies the time force hyper stat modifiers
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyMaxTF() {
    const addition = Util.calcMaxTF(this);
    this.modified.maxTF = this.base.maxTF + addition;
    return this;
  };
  /**
   * Applies the hyper critical rate % hyper stat modifier
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyCrit() {
    const addition = Util.calcCrit(this);
    this.modified.crit = this.base.crit + addition;
    return this;
  };
  /**
   * Applies the critical damage % hyper stat modifier
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyCritDmg() {
    const addition = Util.calcCritDmg(this);
    this.modified.critDmg = this.base.critDmg + addition;
    return this;
  };
  /**
   * Applies the ignore defense % hyper stat modifier
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyIgnoreDef() {
    const addition = Util.calcIgnoreDef(this);
    this.modified.ignoreDef = this.base.ignoreDef + addition;
    return this;
  };
  /**
   * Applies the boss dmg % hyper stat modifier
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyBossDmg() {
    this.modified.bossDmg = this.base.bossDmg + Util.calcBossDmg(this);
    return this;
  };
  /**
   * Applies the dmg % hyper stat modifier
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyDmg() {
    this.modified.dmg = this.base.dmg + Util.calcDmg(this);
    return this;
  };
  /**
   * Applies the status resistance hyper stat modifier
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyStatusResist() {
    const addition = Util.calcStatusResist();
    this.modified.statusResist = this.base.statusResist + addition;
    return this;
  };
  /**
   * Applies the stance hyper stat modifier
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyStance() {
    const addition = Util.calcStance(this);
    this.modified.stance = this.base.stance + addition;
    return this;
  };
  /**
   * Applies the weapon ATT hyper stat modifier
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyWeaponAtt() {
    const addition = Util.calcWeaponAtt(this);
    this.modified.weaponAtt = this.base.weaponAtt + addition;
    return this;
  };
  /**
   * Applies the magic ATT hyper stat modifier
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyMagicAtt() {
    const addition = Util.calcMagicAtt(this);
    this.modified.magicAtt = this.base.magicAtt + addition;
    return this;
  };
  /**
   * Applies the bonus EXP % hyper stat modifier
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyBonusExp() {
    const addition = Util.calcBonuxExp(this);
    this.modified.bonusExp = this.base.bonusExp + addition;
    return this;
  };
  /**
   * Applies the arcane force hyper stat modifier
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyArcaneForce() {
    const addition = Util.calcArcaneForce(this);
    this.modified.arcaneForce = this.base.arcaneForce + addition;
  };
  /**
   * Applies all the hyper stat modifiers
   * @return {HyperStats} A reference to the current HyperStats object
   */
  applyAll() {
    this.applyArcaneForce();
    this.applyBonusExp();
    this.applyCrit();
    this.applyCritDmg();
    this.applyDF();
    this.applyTF();
    this.applyDmg();
    this.applyIgnoreDef();
    this.applyMaxHP();
    this.applyMaxMP();
    this.applyPureStats();
    this.applyStance();
    this.applyStatusResist();
    this.applyWeaponAtt();
    this.applyMagicAtt();
    return this;
  };
  /**
   * Gets the modified stat values
   * @return {Object} The modified player stats Object
   */
   get() {
    return this.modified;
  }
}
module.exports = {HyperStats};
