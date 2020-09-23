import { Message, MessageType } from './message';

describe('Message', () => {
  it('should create an message', () => {
    expect(new Message('0', 'Sep 11 2020', 'subject', 'message', MessageType.System, 'date', true, false)).toBeTruthy();
  });
});
