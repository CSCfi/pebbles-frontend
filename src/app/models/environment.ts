import { Workspace } from './workspace';

export class Environment {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public maximum_lifetime: string,
    public workspace_id: string,
    public labels: string[],
    public thumbnail: string,
    public is_enabled: boolean,
    public instance_id?: string,
    public workspace?: Workspace,
    public workspace_name?: string,
    public config?: any,
  ) {
  }
}
