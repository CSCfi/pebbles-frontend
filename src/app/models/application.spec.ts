import { Application } from './application';

describe('Application', () => {
  it('should create an instance', () => {
    expect(new Application('1', 'name', 'description', 3600, 'workspaceId', ['labels'], 'jupyter', true)).toBeTruthy();
  });
});
