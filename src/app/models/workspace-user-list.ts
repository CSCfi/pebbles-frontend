import { User } from './user';

export class WorkspaceUserList {
  constructor(
    public owner: User,
    public manager_users: User[],
    public normal_users: User[],
    public banned_users: User[],
  ) {
  }
}

