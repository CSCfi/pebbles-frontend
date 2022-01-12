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
    public application_quota?: number
  ) {
  }
}

// Replicate API response defined in pebbles.views.workspace.member_fields in the backend
export interface WorkspaceMember {
  user_id: string;
  ext_id: string;
  email_id: string;
  is_owner: boolean;
  is_manager: boolean;
  is_banned: boolean;
}
