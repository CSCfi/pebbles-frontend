import { Environment } from './environment';

describe('Environment', () => {
  it('should create an instance', () => {
    expect(new Environment('1', 'test', 'Test Environment', '1h', 'workspaceId', 'thumbnail', 'color', ['labels'])).toBeTruthy();
  });
});
