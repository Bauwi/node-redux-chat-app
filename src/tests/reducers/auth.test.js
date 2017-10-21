import authReducer from '../../reducers/auth';

test('should set uid for login', () => {
  const action = {
    type:'LOGIN',
    uid: '123abc'
  };
  const state = authReducer({}, action);
  expect(state).toEqual({
    uid: '123abc'
  });
});

test('should clear uid for logout', () => {
  const action = {
    type: 'LOGOUT'
  };
  const state = authReducer({uid: '123abc'}, action);
  expect(state).toEqual({});
});