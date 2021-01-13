import { User } from './user';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User('u-1', 'user@example.org')).toBeTruthy();
  });
});
