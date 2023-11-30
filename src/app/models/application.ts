import { ApplicationType } from './application-template';
import { Workspace } from './workspace';

// Replicate schema defined in pebbles.utils.check_attribute_limit_format()
export interface AttributeLimit {
  name: string;
  min: number;
  max: number;
}

export class Application {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public maximum_lifetime: number,
    public workspace_id: string,
    public labels: string[],
    public thumbnail: string,
    public is_enabled: boolean,
    public attribute_limits?: AttributeLimit[],
    public template_id?: string,
    public template_name?: string,
    public application_type?: ApplicationType,
    public session_id?: string,
    public workspace?: Workspace,
    public workspace_name?: string,
    public config?: any,
    public info?: any
  ) {
  }
}
