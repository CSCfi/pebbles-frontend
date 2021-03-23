import { Workspace } from './workspace';

describe('Workspace', () => {
  it('should create an instance', () => {
    expect(new Workspace(
      '2',
      '12345678',
      'DL Course 2021',
      'descriptions.....',
      1616572104,
      1632124104,
      'admin@test.org',
      )).toBeTruthy();
  });
});
