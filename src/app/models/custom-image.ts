export interface ImageContent {
  kind: string;
  data: string;
}

export interface ImageDefinition {
  base_image: string;
  user: string;
  image_content: ImageContent[];
}

export interface CustomImage {
  id: string;
  workspace_id: string;
  name: string;
  tag: string;
  definition: ImageDefinition;
  dockerfile: string;
  started_at: string;
  completed_at: string;
  state: string;
  to_be_deleted: boolean;
  build_system_id: string;
  build_system_output: string;
  url: string;
}
