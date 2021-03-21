const {ADDED_STATS, PURE_STATS} = require('./constants.js');
/** Should we be using pre-computed tables? */
/**
 * Provides stat calculations for MapleStory characters
 * @class Stat
 */
export class Stat {
  /**
   * @constructor
   * @param {Object} playerStats 
   */
  constructor({stats, hyper}) {
    this.stats = stats;
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
   * @return {Stat}
   */
  applyHyperPureStats() {
    for (const name of PURE_STATS) {
      this.modified[stat] = this.stats[stat] + this._calcHyperPureStat(name);
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
    return this.stats.maxHp * modifier;
  }
  /**
   * Calculates the Max HP hyper stat modifier
   * @method
   * @private
   * @return {number}
   */
  _calcHyperMaxMP() {
    const modifier = (this.hyper.maxMp * 0x02);
    return this.stats.maxMp * modifier;
  }
  /**
   * Applies the Max HP and Max MP hyper stat modifiers
   * @returns {Stat}
   */
  applyHyperMaxHPMP() {
    this.modified.maxMp = this.stats.maxMp + this._calcHyperMaxHP();
    this.modified.maxHp = this.stats.maxHp + this._calcHyperMaxMP();
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
   * @return {Stat}
   */
  applyHyperDFTF() {
    this.modified.df = this.stats.df + this._calcHyperDF();
    this.modified.tf = this.stats.tf + this._calcHyperTF();
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
   * @return {Stat}
   */
  applyHyperCrit() {
    this.modified.crit = this.stats.crit + this._calcHyperCrit();
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
   * @return {Stat}
   */
  applyHyperCritDmg() {
    this.modified.critDmg = this.stats.critDmg + this._calcHyperCritDmg();
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
   * @return {Stat}
   */
  applyHyperIgnoreDef() {
    this.modified.ignoreDef = this.stats.ignoreDef + this._calcHyperIgnoreDef();
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
   * @return {Stat}
   */
  applyHyperBossDmg() {
    this.modified.bossDmg = this.stats.bossDmg + this._calcHyperBossDmg();
    return this;
  }
  _calcHyperDmg() {
    return this.hyper.dmg * 3;
  }
  applyHyperDmg() {
    this.modified.dmg = this.stats.dmg + this._calcHyperDmg();
    return this;
  }
  _calcHyperStatusResist() {
    if (this.hyper.statusResist < 6) return this.hyper.statusResist;
    return 5 + ((this.hyper.statusResist - 5) * 2);
  }
  applyHyperStatusResist() {
    const newVal = this.stats.statusResist + this._calcHyperStatusResist();
    this.modified.statusResist = newVal;
  }
  _calcHyperStance() {
    return this.hyper.stance * 2;
  }
  applyHyperStance() {
    this.modified.stance = this.stats.stance + this._calcHyperStance();
  }
  _calcHyperWeaponAtt() {
    return this.hyper.weaponAtt * 3;
  }
  _calcHyperMagicAtt() {
    return this.hyper.magicAtt * 3;
  }
  applyHyperWeaponMagicAtt() {
    this.modified.weaponAtt = this.stats.weaponAtt + this._calcHyperWeaponAtt();
    this.modified.magicAtt = this.stats.magicAtt + this._calcHyperMagicAtt();
    return this;
  }
  _calcHyperBonusExp() {
    if (this.hyper.bonusExp < 11) return 0.5 * this.hyper.bonusExp;
    return this.hyper.bonusExp - 5;
  }
  applyHyperBonusExp() {
    /** TODO: Not sure how bonus EXP % is applied */
    this.modifier.bonusExp = this.stats.bonusExp + this._calcHyperBonusExp();
    return this;
  }
  _calcHyperArcaneForce() {
    if (this.hyper.arcaneForce < 11) return this.hyper.arcaneForce * 5;
    else 50 + (this.hyper.arcaneForce - 10) * 10;
  }
  applyHyperArcaneForce() {
    const newVal = this.stats.arcaneForce + this._calcHyperArcaneForce();
    this.modifier.arcaneForce = newVal
  }
}

