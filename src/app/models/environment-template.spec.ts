import {EnvironmentTemplate, EnvironmentType} from './environment-template';

describe('EnvironmentTemplate', () => {
  it('should create an instance', () => {
    expect(new EnvironmentTemplate('id', 'name', 'description',
      EnvironmentType.Jupyter, true, 'cluster', {description: 'dummy'})).toBeTruthy();
  });
});
