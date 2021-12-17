import { ApplicationCategory } from './application-category';

describe('Catalog', () => {
  it('should create an instance', () => {
    expect(new ApplicationCategory('1', 0, 'Test Application', ['test'], 'workspace', true)).toBeTruthy();
  });
});
