import { EnvironmentTemplate } from './environment-template';

describe('EnvironmentTemplate', () => {
  it('should create an instance', () => {
    expect(new EnvironmentTemplate('id', 'name', true, 'cluster', {description: 'dummy'})).toBeTruthy();
  });
});
