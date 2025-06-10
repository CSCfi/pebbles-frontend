export interface ImageContent {
  kind: string;
  data: string;
}

export interface ImageDefinition {
  base_image: string;
  user: string;
  image_content: ImageContent[];
}

// states defined in pebbles.models.CustomImage
export enum BuildState {
  New = 'new',
  Building = 'building',
  Failed = 'failed',
  Completed = 'completed',
  Deleted = 'deleted',
  // Deleting state is frontend only, made for simplifying rendering logic. It is set when to_be_deleted is set.
  Deleting = 'deleting'
}

// API response defined in pebbles.views.custom_images.custom_image_fields in the backend
export interface CustomImage {
  id: string;
  workspace_id: string;
  name: string;
  tag: number;
  definition: ImageDefinition;
  dockerfile: string;
  created_at: string;
  started_at: string;
  completed_at: string;
  state: BuildState;
  to_be_deleted: boolean;
  build_system_id: string;
  build_system_output: string;
  url: string;
}
