import { EnvironmentSession, SessionStates } from './environment-session';

describe('EnvironmentSession', () => {
  it('should create an instance', () => {
    expect(new EnvironmentSession('0', 'user-0', 'name', '', SessionStates.Running, '')).toBeTruthy();
  });
});
