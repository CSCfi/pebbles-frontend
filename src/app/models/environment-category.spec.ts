import { EnvironmentCategory } from './environment-category';

describe('Catalog', () => {
  it('should create an instance', () => {
    expect(new EnvironmentCategory('1', 0, 'Test Environment', ['test'], 'workspace', true)).toBeTruthy();
  });
});
