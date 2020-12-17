import { Instance, InstanceStates } from './instance';

describe('Instance', () => {
  it('should create an instance', () => {
    expect(new Instance('0', 'user-0', 'name', '', InstanceStates.Running, '')).toBeTruthy();
  });
});
