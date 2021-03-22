const {ADDED_STATS, PURE_STATS} = require('./constants.js');
/** Should we be using pre-computed tables? */
/**
 * Provides stat calculations for MapleStory characters
 * @class Stats
 */
export class Stats {
  /**
   * @constructor
   * @param {Object} playerStats 
   */
  constructor({base, hyper}) {
    this.base = base;
    this.hyper = hyper;
    this.modified = Object.assign({}, stats);
  }
  /**
   * Calculates hyper pure stat modifiers
   * @method _calcHyperPureStat
   * @private
   * @param {string} stat
   */
  _calcHyperPureStat(stat) {
    return this.hyper[stat] * 30;
  }
  /**
   * Applies the hyper pure stat modifiers
   * @method
   * @return {Stats}
   */
  applyHyperPureStats() {
    for (const name of PURE_STATS) {
      this.modified[stat] = this.base[stat] + this._calcHyperPureStat(name);
    }
    return this;
  }
  /**
   * Calculates the Max HP hyper stat modifier
   * @method
   * @private
   * @return {number}
   */
  _calcHyperMaxHP() {
    const modifier = (this.hyper.maxHp * 0.02);
    return this.base.maxHp * modifier;
  }
  /**
   * Calculates the Max HP hyper stat modifier
   * @method
   * @private
   * @return {number}
   */
  _calcHyperMaxMP() {
    const modifier = (this.hyper.maxMp * 0x02);
    return this.base.maxMp * modifier;
  }
  /**
   * Applies the Max HP and Max MP hyper stat modifiers
   * @returns {Stats}
   */
  applyHyperMaxHPMP() {
    this.modified.maxMp = this.base.maxMp + this._calcHyperMaxHP();
    this.modified.maxHp = this.base.maxHp + this._calcHyperMaxMP();
    return this;
  }
  /**
   * Calculates the hyper demon force stat modifier
   * @method
   * @private
   * @return {number}
   */
  _calcHyperDF() {
    return this.hyper.df * 10;
  }
  /**
   * Calculates the hyper time force stat modifier
   * @method
   * @private
   * @return {number}
   */
  _calcHyperTF() {
    return this.hyper.tf * 10;
  }
  /**
   * Applies the hyper demon force and time force stat modifiers
   * @method
   * @return {Stats}
   */
  applyHyperDFTF() {
    this.modified.df = this.base.df + this._calcHyperDF();
    this.modified.tf = this.base.tf + this._calcHyperTF();
    return this;
  }
  /**
   * Calculates the hyper critical rate% stat modifier
   * @method
   * @private
   * @return {number}
   */
  _calcHyperCrit() {
    if (this.hyper.crit < 6) return this.hyper.crit;
    return 5 + (this.hyper.crit - 5) * 2;
  }
  /**
   * Applies the hyper critical rate% stat modifier
   * @method
   * @return {Stats}
   */
  applyHyperCrit() {
    this.modified.crit = this.base.crit + this._calcHyperCrit();
    return this;
  }
  /**
   * Calculates the hyper critical damage% stat modifier
   * @method
   * @private
   * @return {number}
   */
  _calcHyperCritDmg() {
    return this.hyper.critDmg;
  }
  /**
   * Applies the hyper critical damage% stat modifier
   * @method
   * @return {Stats}
   */
  applyHyperCritDmg() {
    this.modified.critDmg = this.base.critDmg + this._calcHyperCritDmg();
    return this;
  }
  /**
   * Calculates the hyper ignore defense% stat modifier
   * @method
   * @private
   * @return {number}
   */
  _calcHyperIgnoreDef() {
    return this.hyper.ignoreDef * 3;
  }
  /**
   * Applies the hyper ignore defense% stat modifier
   * @method
   * @return {Stats}
   */
  applyHyperIgnoreDef() {
    this.modified.ignoreDef = this.base.ignoreDef + this._calcHyperIgnoreDef();
    return this;
  }
  /**
   * Calculates the hyper boss dmg% stat modifier
   * @method
   * @private
   * @returns {number}
   */
  _calcHyperBossDmg() {
    if (this.hyper.bossDmg < 6) return this.hyper.bossDmg * 3;
    return 15 + ((this.hyper.bossDmg - 5) * 4);
  }
  /**
   * Applies the hyper boss dmg% stat modifier
   * @method
   * @return {Stats}
   */
  applyHyperBossDmg() {
    this.modified.bossDmg = this.base.bossDmg + this._calcHyperBossDmg();
    return this;
  }
  _calcHyperDmg() {
    return this.hyper.dmg * 3;
  }
  applyHyperDmg() {
    this.modified.dmg = this.base.dmg + this._calcHyperDmg();
    return this;
  }
  _calcHyperStatusResist() {
    if (this.hyper.statusResist < 6) return this.hyper.statusResist;
    return 5 + ((this.hyper.statusResist - 5) * 2);
  }
  applyHyperStatusResist() {
    const newVal = this.base.statusResist + this._calcHyperStatusResist();
    this.modified.statusResist = newVal;
  }
  _calcHyperStance() {
    return this.hyper.stance * 2;
  }
  applyHyperStance() {
    this.modified.stance = this.base.stance + this._calcHyperStance();
  }
  _calcHyperWeaponAtt() {
    return this.hyper.weaponAtt * 3;
  }
  _calcHyperMagicAtt() {
    return this.hyper.magicAtt * 3;
  }
  applyHyperWeaponMagicAtt() {
    this.modified.weaponAtt = this.base.weaponAtt + this._calcHyperWeaponAtt();
    this.modified.magicAtt = this.base.magicAtt + this._calcHyperMagicAtt();
    return this;
  }
  _calcHyperBonusExp() {
    if (this.hyper.bonusExp < 11) return 0.5 * this.hyper.bonusExp;
    return this.hyper.bonusExp - 5;
  }
  applyHyperBonusExp() {
    /** TODO: Not sure how bonus EXP % is applied */
    this.modifier.bonusExp = this.base.bonusExp + this._calcHyperBonusExp();
    return this;
  }
  _calcHyperArcaneForce() {
    if (this.hyper.arcaneForce < 11) return this.hyper.arcaneForce * 5;
    else 50 + (this.hyper.arcaneForce - 10) * 10;
  }
  applyHyperArcaneForce() {
    const newVal = this.base.arcaneForce + this._calcHyperArcaneForce();
    this.modifier.arcaneForce = newVal
  }
  applyHyperStats() {
    this.applyHyperArcaneForce();
    this.applyHyperBonusExp();
    this.applyHyperCrit();
    this.applyHyperCritDmg();
    this.applyHyperDFTF();
    this.applyHyperDmg();
    this.applyHyperIgnoreDef();
    this.applyHyperMaxHPMP();
    this.applyHyperPureStats();
    this.applyHyperStance();
    this.applyHyperStatusResist();
    this.applyHyperWeaponMagicAtt();
  }
}
module.exports = {Stats};
