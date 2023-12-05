import { ApplicationType } from './application-template';
import { Workspace } from './workspace';

// Replicate schema defined in pebbles.utils.check_attribute_limit_format()
export interface AttributeLimit {
  name: string;
  min: number;
  max: number;
}

// Replicate API response defined in pebbles.views.applications.application_field_role_map
export interface Application {
  id: string;
  name: string;
  description: string;
  maximum_lifetime: number;
  workspace_id: string;
  labels: string[];
  thumbnail: string;
  is_enabled: boolean;
  attribute_limits?: AttributeLimit[];
  template_id?: string;
  template_name?: string;
  application_type?: ApplicationType;
  session_id?: string;
  workspace?: Workspace;
  workspace_name?: string;
  config?: any;
  info?: any;
}
