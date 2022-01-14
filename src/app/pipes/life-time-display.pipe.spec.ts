import { LifeTimeDisplayPipe } from './life-time-display.pipe';

describe('TimeDisplayPipe', () => {
  it('create an instance', () => {
    const pipe = new LifeTimeDisplayPipe();
    expect(pipe).toBeTruthy();
  });
});
