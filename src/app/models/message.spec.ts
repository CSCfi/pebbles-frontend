import { Announcement} from './announcement';

describe('Message', () => {
  it('should create an message', () => {
    expect(new Announcement('0', '2020-09-01', 'subject', 'message')).toBeTruthy();
  });
});
