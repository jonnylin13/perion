const assert = require('assert');
const StateContainer = require('../src/stateContainer.js');
describe('@perion/core.StateContainer', function() {
  it('should initialize a state container and get', function() {
    const state = new StateContainer({test: true, value: 1});
    state.get('test').then(res => {
      assert(res, true);
      state.get('value').then(res => {
        assert(res, 1)
      })
    });
  });
  it('should set, get, delete, then get to return null', async function() {
    const state = new StateContainer({value: 1});
    await state.set('value', 2);
    const check = await state.get('value');
    assert(check === 2);
    await state.delete('value');
    const undef = await state.get('value');
    assert(undef === undefined);
  });
  it('should pack and and construct a serialized state container', async function() {
    const state = new StateContainer(
      {
        arr: [1, 'test', 3], 
        bool: true, 
        number: 1,
        string: 'test',
        bigint: BigInt(2)
      }
    );
    const packed = await state.pack();
    const unpacked = await StateContainer.from(packed);
    assert.deepEqual(unpacked.state, {
      arr: [1, 'test', 3],
      bool: true,
      number: 1,
      string: 'test',
      bigint: BigInt(2n)
    });
    // TODO: Allow Object as datatype
  });
});