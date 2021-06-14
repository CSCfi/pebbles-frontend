import { Faq } from './faq';

describe('Faq', () => {
  it('should create an instance', () => {
    expect(new Faq('test',
      [
      {
        question: 'question',
        answer: 'answer'
      }
    ])).toBeTruthy();
  });
});
