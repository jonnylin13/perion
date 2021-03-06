/**
 * Global MapleStory IV
 * @constant
 */
const GMS_IV = Buffer.from([
  0x4D, 0x23, 0xC7, 0x2B, 
  0x4D, 0x23, 0xC7, 0x2B, 
  0x4D, 0x23, 0xC7, 0x2B, 
  0x4D, 0x23, 0xC7, 0x2B
]);
/**
 * MapleSEA (Asia) IV
 * @constant
 */
const SEA_IV = Buffer.from([
  0xB9, 0x7D, 0x63, 0xE9, 
  0xB9, 0x7D, 0x63, 0xE9, 
  0xB9, 0x7D, 0x63, 0xE9, 
  0xB9, 0x7D, 0x63, 0xE9
]);
/**
 * Default IV
 * @constant
 */
const DEFAULT_IV = Buffer.from([
  0x13, 0x00, 0x00, 0x00,
	0x08, 0x00, 0x00, 0x00,
	0x06, 0x00, 0x00, 0x00,
	0xB4, 0x00, 0x00, 0x00,
	0x1B, 0x00, 0x00, 0x00,
	0x0F, 0x00, 0x00, 0x00,
	0x33, 0x00, 0x00, 0x00,
	0x52, 0x00, 0x00, 0x00
]);
/**
 * AES Key
 * @constant
 */
const AES_KEY = Buffer.from([
  0x13, 0x00, 0x00, 0x00, 0x08, 0x00, 
  0x00, 0x00, 0x06, 0x00, 0x00, 0x00,
  0xB4, 0x00, 0x00, 0x00, 0x1B, 0x00, 
  0x00, 0x00, 0x0F, 0x00, 0x00, 0x00, 
  0x33, 0x00, 0x00, 0x00, 0x52, 0x00,
  0x00, 0x00
]);
/**
 * Offset Key
 * @constant
 */
const OFFSET_KEY = 0x581c3f6d;