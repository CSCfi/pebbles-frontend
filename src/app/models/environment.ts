import { Instance } from './instance';
import { Workspace } from './workspace';

export class Environment {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public maximumLifetime: string,
    public workspace_id: string,
    public thumbnail: string,
    public color: string,
    public labels: string[],
    public instance?: Instance,
    public workspace?: Workspace,
    public workspace_name?: string,
    public config?: any,

  ) {
  }
}
