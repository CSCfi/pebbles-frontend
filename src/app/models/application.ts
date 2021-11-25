import { ApplicationType } from './application-template';
import { Workspace } from './workspace';

export class Application {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public maximum_lifetime: string,
    public workspace_id: string,
    public labels: string[],
    public thumbnail: string,
    public is_enabled: boolean,
    public template_id?: string,
    public template_name?: string,
    public applicationType?: ApplicationType,
    public session_id?: string,
    public workspace?: Workspace,
    public workspace_name?: string,
    public config?: any,
    public info?: any
  ) {
  }
}
