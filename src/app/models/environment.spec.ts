import { Environment } from './environment';

describe('Environment', () => {
  it('should create an instance', () => {
    expect(new Environment('1', 'name', 'description', '1h', 'workspaceId', ['labels'], 'jupyter', true)).toBeTruthy();
  });
});
