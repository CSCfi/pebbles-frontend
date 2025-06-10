// defined in backend pebbles/models.py
export enum ApplicationType {
  Jupyter = 'jupyter',
  RStudio = 'rstudio',
  Generic = 'generic'
}

export enum ImageSourceType {
  Template = 'template',
  Customized = 'customized',
  Original = 'original'
}

export class ApplicationTemplate {
  public static EXAMPLE_TEMPLATE_NAME = 'Example';

  constructor(
    public id: string,
    public name: string,
    public description: string,
    public application_type: ApplicationType,
    public is_enabled: boolean,
    public base_config: any,
  ) {
  }
}
