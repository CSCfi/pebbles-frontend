export class EnvironmentCategory {
  constructor(
    public id: string,
    public order: number,
    public name: string,
    public labels: string[],
    public type: string,
    public is_default: boolean,
    ) {
  }
}
