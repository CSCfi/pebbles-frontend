export class Workspace {
  constructor(
      public id: string,
      public joinCode: string,
      public name: string,
      public description: string,
      public ownerEppn: string,
      public owner_eppn?: string,
      public member_eppns?: string[],
      ) {}
}
