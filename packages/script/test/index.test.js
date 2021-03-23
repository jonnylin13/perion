const assert = require('assert');
const script = require('../index.js');
describe('@perion/script module exports', function() {
  it('should export script.ContextProvider', function() {
    assert('ContextProvider' in script);
  });
  it('should export script.ScriptProvider', function() {
    assert('ScriptProvider' in script);
  });
  it('should export script.Engine', function() {
    assert('Engine' in script);
  });
});