import {ApplicationTemplate, ApplicationType} from './application-template';

describe('ApplicationTemplate', () => {
  it('should create an instance', () => {
    expect(new ApplicationTemplate('id', 'name', 'description',
      ApplicationType.Jupyter, true, 'cluster', {description: 'dummy'})).toBeTruthy();
  });
});
