import authReducer from '../../reducers/auth';

import { users } from './../../../server/tests/seed/seed';

test('should set uid for login', () => {
  const action = {
    type: 'LOGIN',
    user: users[1]
  };
  const state = authReducer({}, action);
  expect(state).toEqual({
    user: users[1]
  });
});

test('should clear uid for logout', () => {
  const action = {
    type: 'LOGOUT'
  };
  const state = authReducer({ uid: '123abc' }, action);
  expect(state).toEqual({});
});
