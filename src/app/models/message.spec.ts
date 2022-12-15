import { Message } from './message';

describe('Message', () => {
  it('should create an message', () => {
    expect(new Message('0', '2020-09-01', 'subject', 'test')).toBeTruthy();
  });
});
