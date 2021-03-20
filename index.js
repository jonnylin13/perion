const {AES, Shanda} = require('./packages/crypto/index');
const Packet = require('./packages/net/packet');
/**
 * A module that exports all titan packages
 * @module @titan/titan
 */
exports.Crypto = {AES, Shanda};
exports.Packet = Packet;
