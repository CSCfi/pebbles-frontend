
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
    public owner_ext_id: string,
    public manager_ext_ids?: string[],
    public member_ext_ids?: string[],
    public manager_users?: string[],
    public normal_users?: string[],
  ) { }
}
