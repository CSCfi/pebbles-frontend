import { Application } from './application';

describe('Application', () => {
  it('should create an instance', () => {
    expect(new Application('1', 'name', 'description', '1h', 'workspaceId', ['labels'], 'jupyter', true)).toBeTruthy();
  });
});
