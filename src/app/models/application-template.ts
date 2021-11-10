// defined in backend pebbles/models.py
export enum ApplicationType {
  Jupyter = 'jupyter',
  RStudio = 'rstudio',
  Generic = 'generic'
}

export class ApplicationTemplate {
  public static EXAMPLE_TEMPLATE_NAME = 'Example';

  constructor(
    public id: string,
    public name: string,
    public description: string,
    public applicationType: ApplicationType,
    public is_active: boolean,
    public cluster: string,
    public base_config: any,
  ) {
  }
}
