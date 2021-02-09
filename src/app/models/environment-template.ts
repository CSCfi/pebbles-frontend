export class EnvironmentTemplate {
  public static EXAMPLE_TEMPLATE_NAME = 'Example';

  constructor(
    public id: string,
    public name: string,
    public description: string,
    public is_active: boolean,
    public cluster: string,
    public base_config: any,
  ) {
  }
}
