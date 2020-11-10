export class Workspace {
  constructor(
      public id: string,
      public join_code: string,
      public name: string,
      public description: string,
      public owner_eppn?: string,
      public manager_eppns?: string[],
      public member_eppns?: string[],
      ) {}
}
