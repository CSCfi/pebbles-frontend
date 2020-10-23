export class User {
  constructor(
    public id?: string,
    public email_id?: string,
    public eppn?: string,
    public password?: string,
    public is_admin?: boolean,
    public is_workspace_owner?: boolean,
    public is_workspace_manager?: boolean,
    ) {
  }
}
