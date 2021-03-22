const {ADDED_STATS, PURE_STATS} = require('./constants.js');
/** Should we be using pre-computed tables? */
/**
 * Provides hyper stat calculations for MapleStory characters
 * @class HyperStats
 */
class HyperStats {
  /**
   * @constructor
   * @param {Object} playerStats 
   */
  constructor({base, hyper}) {
    this.base = base;
    this.hyper = hyper;
    this.modified = Object.assign({}, {base, hyper});
  }
  /**
   * Calculates hyper pure stat modifiers
   * @method
   * @private
   * @param {string} stat
   */
  _calcPureStat(stat) {
    return this.hyper[stat] * 30;
  }
  /**
   * Applies the hyper pure stat modifiers
   * @method
   * @return {Stats}
   */
  applyPureStats() {
    for (const name of PURE_STATS) {
      this.modified[name] = this.base[name] + this._calcPureStat(name);
    }
    return this;
  }
  /**
   * Calculates the Max HP hyper stat modifier
   * @method
   * @private
   * @return {number}
   */
  _calcMaxHP() {
    const modifier = (this.hyper.maxHp * 0.02);
    return this.base.maxHp * modifier;
  }
  /**
   * Calculates the Max HP hyper stat modifier
   * @method
   * @private
   * @return {number}
   */
  _calcMaxMP() {
    const modifier = (this.hyper.maxMp * 0x02);
    return this.base.maxMp * modifier;
  }
  /**
   * Applies the Max HP and Max MP hyper stat modifiers
   * @returns {Stats}
   */
  applyMaxHPMP() {
    this.modified.maxMp = this.base.maxMp + this._calcMaxHP();
    this.modified.maxHp = this.base.maxHp + this._calcMaxMP();
    return this;
  }
  /**
   * Calculates the hyper demon force stat modifier
   * @method
   * @private
   * @return {number}
   */
  _calcDF() {
    return this.hyper.df * 10;
  }
  /**
   * Calculates the hyper time force stat modifier
   * @method
   * @private
   * @return {number}
   */
  _calcTF() {
    return this.hyper.tf * 10;
  }
  /**
   * Applies the hyper demon force stat modifiers
   * @method
   * @return {Stats}
   */
  applyDF() {
    this.modified.df = this.base.df + this._calcDF();
    return this;
  }
  /**
   * Applies the hyper time force stat modifiers
   * @returns {HyperStats}
   */
  applyTF() {
    this.modified.tf = this.base.tf + this._calcTF();
    return this;
  }
  /**
   * Calculates the hyper critical rate% stat modifier
   * @method
   * @private
   * @return {number}
   */
  _calcCrit() {
    if (this.hyper.crit < 6) return this.hyper.crit;
    return 5 + (this.hyper.crit - 5) * 2;
  }
  /**
   * Applies the hyper critical rate% stat modifier
   * @method
   * @return {Stats}
   */
  applyCrit() {
    this.modified.crit = this.base.crit + this._calcCrit();
    return this;
  }
  /**
   * Calculates the hyper critical damage% stat modifier
   * @method
   * @private
   * @return {number}
   */
  _calcCritDmg() {
    return this.hyper.critDmg;
  }
  /**
   * Applies the hyper critical damage% stat modifier
   * @method
   * @return {Stats}
   */
  applyCritDmg() {
    this.modified.critDmg = this.base.critDmg + this._calcHyperDmg();
    return this;
  }
  /**
   * Calculates the hyper ignore defense% stat modifier
   * @method
   * @private
   * @return {number}
   */
  _calcIgnoreDef() {
    return this.hyper.ignoreDef * 3;
  }
  /**
   * Applies the hyper ignore defense% stat modifier
   * @method
   * @return {Stats}
   */
  applyIgnoreDef() {
    this.modified.ignoreDef = this.base.ignoreDef + this._calcIgnoreDef();
    return this;
  }
  /**
   * Calculates the hyper boss dmg% stat modifier
   * @method
   * @private
   * @returns {number}
   */
  _calcBossDmg() {
    if (this.hyper.bossDmg < 6) return this.hyper.bossDmg * 3;
    return 15 + ((this.hyper.bossDmg - 5) * 4);
  }
  /**
   * Applies the hyper boss dmg% stat modifier
   * @method
   * @return {Stats}
   */
  applyBossDmg() {
    this.modified.bossDmg = this.base.bossDmg + this._calcBossDmg();
    return this;
  }
  _calcDmg() {
    return this.hyper.dmg * 3;
  }
  applyDmg() {
    this.modified.dmg = this.base.dmg + this._calcDmg();
    return this;
  }
  _calcStatusResist() {
    if (this.hyper.statusResist < 6) return this.hyper.statusResist;
    return 5 + ((this.hyper.statusResist - 5) * 2);
  }
  applyStatusResist() {
    const newVal = this.base.statusResist + this._calcStatusResist();
    this.modified.statusResist = newVal;
  }
  _calcStance() {
    return this.hyper.stance * 2;
  }
  applyStance() {
    this.modified.stance = this.base.stance + this._calcStance();
  }
  _calcWeaponAtt() {
    return this.hyper.weaponAtt * 3;
  }
  _calcMagicAtt() {
    return this.hyper.magicAtt * 3;
  }
  applyWeaponMagicAtt() {
    this.modified.weaponAtt = this.base.weaponAtt + this._calcWeaponAtt();
    this.modified.magicAtt = this.base.magicAtt + this._calcMagicAtt();
    return this;
  }
  _calcBonusExp() {
    if (this.hyper.bonusExp < 11) return 0.5 * this.hyper.bonusExp;
    return this.hyper.bonusExp - 5;
  }
  applyBonusExp() {
    /** TODO: Not sure how bonus EXP % is applied */
    this.modifier.bonusExp = this.base.bonusExp + this._calcBonusExp();
    return this;
  }
  _calcArcaneForce() {
    if (this.hyper.arcaneForce < 11) return this.hyper.arcaneForce * 5;
    else 50 + (this.hyper.arcaneForce - 10) * 10;
  }
  applyArcaneForce() {
    const newVal = this.base.arcaneForce + this._calcArcaneForce();
    this.modifier.arcaneForce = newVal
  }
  applyAll() {
    this.applyArcaneForce();
    this.applyBonusExp();
    this.applyCrit();
    this.applyCritDmg();
    this.applyDF();
    this.applyDF();
    this.applyDmg();
    this.applyIgnoreDef();
    this.applyMaxHPMP();
    this.applyPureStats();
    this.applyStance();
    this.applyStatusResist();
    this.applyWeaponMagicAtt();
  }
  get() {
    return this.modified;
  }
}
module.exports = {HyperStats};
