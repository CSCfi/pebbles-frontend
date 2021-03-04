import { Utilities } from './utilities';

describe('Utilities', () => {
  it('should create an instance', () => {
    expect(new Utilities()).toBeTruthy();
  });
  it('should convert lifetimes to strings', () => {
    expect(Utilities.lifetimeToString(3600)).toBe('01:00');
    expect(Utilities.lifetimeToString(3599)).toBe('00:59');
    expect(Utilities.lifetimeToString(0)).toBe('00:00');
  });
});
