import { Utilities } from '../utilities';

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

  public static hasExpired(ws): boolean {
    if (ws.expiry_ts) {
      return Utilities.isExpiredTimestamp(ws.expiry_ts);
    }
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
      ws1.memory_limit_gib === ws2.memory_limit_gib &&
      ws1.user_association_type === ws2.user_association_type
    );
  }

  /**
   * Returns a sorted shallow copy of the workspaces array. See the switch case source code for supported sort criteria.
   *
   * @param workspaces
   * @param fields sort criteria, from most significant to least significant.
   */
  public static sortWorkspaces(workspaces: Workspace[], fields: string[]): Workspace[] {
    // TODO add sort direction
    const res = workspaces.slice();

    res.sort((a, b) => {
      // loop through the given criteria. Be careful not to return anything in the loop if field values are equal,
      // in that case we want to continue to the next field
      for (const field of fields) {
        switch (field) {
          case 'create_ts': {
            // newest first
            if (a.create_ts != b.create_ts) {
              return b.create_ts - a.create_ts;
            }
            break;
          }
          case 'expiry_ts': {
            // newest first
            if (a.expiry_ts != b.expiry_ts) {
              return b.expiry_ts - a.expiry_ts;
            }
            break;
          }
          case 'role': {
            // sort more important roles first
            const roleDelta = Object.values(UserAssociationType).indexOf(a.user_association_type)
              - Object.values(UserAssociationType).indexOf(b.user_association_type);
            if (roleDelta !== 0) {
              return roleDelta;
            }
            break;
          }
          case 'expiry': {
            // expired workspaces last
            const delta = b.expiry_ts - a.expiry_ts;
            if (delta !== 0) {
              if (Workspace.hasExpired(a) && Workspace.hasExpired(b)) {
                return delta;
              }
              if (Workspace.hasExpired(a)) {
                return 1;
              }
              if (Workspace.hasExpired(b)) {
                return -1;
              }
            }
          }
        }
      }
    });

    return res;
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
