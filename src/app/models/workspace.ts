export enum UserAssociationType {
  Public = 'public',
  Admin = 'admin',
  Owner = 'owner',
  Manager = 'manager',
  Member = 'member'
}

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
    public application_quota?: number,
    public memory_limit_gib?: number,
    public user_association_type?: UserAssociationType
  ) {
  }

  public static equals(ws1: Workspace, ws2: Workspace): boolean {
    if (ws1 === ws2) {
      return true;
    }
    return (
      ws1.id === ws2.id &&
      ws1.join_code === ws2.join_code &&
      ws1.name === ws2.name &&
      ws1.description === ws2.description &&
      ws1.create_ts === ws2.create_ts &&
      ws1.expiry_ts === ws2.expiry_ts &&
      ws1.owner_ext_id === ws2.owner_ext_id &&
      ws1.application_quota === ws2.application_quota &&
      ws1.user_association_type === ws2.user_association_type
    );
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
