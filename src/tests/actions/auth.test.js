import { login, logout } from '../../actions/auth';
import { users } from './../../../server/tests/seed/seed';

test('should setup login action object', () => {
  const action = login(users[1]);
  expect(action.user).toEqual(users[1]);
});

test('should setup logout action object', () => {
  const action = logout();
  expect(action).toEqual({
    type: 'LOGOUT'
  });
});
