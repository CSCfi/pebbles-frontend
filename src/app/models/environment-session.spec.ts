import { ApplicationSession, SessionStates } from './application-session';

describe('EnvironmentSession', () => {
  it('should create an instance', () => {
    expect(new ApplicationSession('0', 'user-0', 'name', '', SessionStates.Running, '')).toBeTruthy();
  });
});
