export class Announcement {

  constructor(
    public id: string,
    public broadcasted: string,
    public subject: string,
    public message: string,
    public is_read?: boolean,
    public is_important?: boolean,
  ) {
  }
}
