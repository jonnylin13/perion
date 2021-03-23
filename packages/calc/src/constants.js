/**
 * @ignore
 * @param {number} version MapleStory version
 * @returns The added stats constants
 */
const ADDED_STATS = function(version) {
  switch(version) {
    default:
      return {
        'HYPER': {
          'COST_TABLE': {
            1: 1,
            2: 2,
            3: 4,
            4: 8,
            5: 10,
            6: 15,
            7: 20,
            8: 25,
            9: 30,
            10: 35,
            11: 50,
            12: 65,
            13: 80,
            14: 95,
            15: 110
          }
        }
      };
  }
};
const PURE_STATS = ['str', 'dex', 'luk', 'int'];
module.exports = {ADDED_STATS, PURE_STATS};