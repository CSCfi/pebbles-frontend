import { Application } from './application';

describe('Environment', () => {
  it('should create an instance', () => {
    expect(new Application('1', 'name', 'description', '1h', 'workspaceId', ['labels'], 'jupyter', true)).toBeTruthy();
  });
});
