// tslint:disable-next-line:no-empty-interface
export interface Content {
  question: string;
  answer: string;
}

export class Faq {
  constructor(
    public name: string,
    public content: Content[]
  ) {
  }
}
