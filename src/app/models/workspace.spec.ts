import { Application } from './application';
import { Workspace } from './workspace';

describe('Workspace', () => {
  it('should create an instance', () => {
    expect(new Workspace(
      'id',
      'join-code',
      'Name',
      'descriptions.....',
      1616572104,
      1632124104,
      'admin@test.org',
      )).toBeTruthy();
  });
});
