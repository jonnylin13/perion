BigInt.prototype.toJSON = function() {
  return `bigint;${this.toString()}n`;
}