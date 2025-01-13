export interface ImageContent {
  kind: string;
  data: string;
}

export interface ImageDefinition {
  base_image: string;
  user: string;
  image_content: ImageContent[];
}

export enum BuildState {
  Deleting = 'deleting',
  Deleted = 'deleted',
  New = 'new',
  Building = 'building',
  Failed = 'failed',
  Completed = 'completed'
}

export interface CustomImage {
  id: string;
  workspace_id: string;
  name: string;
  tag: number;
  definition: ImageDefinition;
  dockerfile: string;
  started_at: string;
  completed_at: string;
  state: BuildState;
  to_be_deleted: boolean;
  build_system_id: string;
  build_system_output: string;
  url: string;
}
