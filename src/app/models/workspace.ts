
export class Workspace {
  public static DEMO_WORKSPACE_NAME = 'Demo Workspace';
  public static SYSTEM_WORKSPACE_NAME = 'System.default';

  constructor(
    public id: string,
    public join_code: string,
    public name: string,
    public description: string,
    public create_ts: number,
    public expiry_ts: number,
    public owner_eppn: string,
    public manager_eppns?: string[],
    public member_eppns?: string[],
  ) { }
}
