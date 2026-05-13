import { ApplicationCategory } from './application-category';

describe('Catalog', () => {
  it('should create an instance', () => {
    expect(new ApplicationCategory('Test Application', ['test'])).toBeTruthy();
  });
});
