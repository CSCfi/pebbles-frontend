// Replicate API response defined in pebbles.commons.views.user_fields in the backend
export class User {
  constructor(
    public id: string,
    public ext_id: string,
    public email_id?: string,
    public pseudonym?: string,
    public workspace_quota?: number,
    public is_active?: boolean,
    public is_admin?: boolean,
    public is_deleted?: boolean,
    public is_blocked?: boolean,
    public expiry_date?: string,
  ) {}
}
