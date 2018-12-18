function createStore(reducer, initialState) {
  let state = initialState;
  const store = {
    getState() {
      return state;
    },
    dispatch(action) {
      state = reducer(state, action);
      return action;
    },
  };
  store.dispatch({ type: '@@redux/INIT' }); // 先触发一次reducer来初始化state树
  return store;
}

function combineReducers(reducers) {
  return function(state = {}, action) {
    return Object.keys(reducers).reduce((newState, key) => {
      // 对每组reducer下发state与之对应的部分，把返回值组成新state
      newState[key] = reducers[key](state[key], action);
      return newState;
    }, {});;
  }
}
