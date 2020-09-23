import { Profile } from './profile';

describe('Profile', () => {
  it('should create an instance', () => {
    expect(new Profile('0', 'admin@csc.fi', 'Tieteen Tietotekniikan', 'user-admin.png')).toBeTruthy();
  });
});
