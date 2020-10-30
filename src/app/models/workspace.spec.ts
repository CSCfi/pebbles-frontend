import { Workspace } from './workspace';

describe('Workspace', () => {
  it('should create an instance', () => {
    expect(new Workspace(
      '2',
      '12345678',
      'DL Course 2021',
      'descriptions.....',
      'admin@test.org'
      )).toBeTruthy();
  });
});
