// Replicate API response defined in pebbles.views.service_announcement in the backend
export interface ServiceAnnouncement {
  subject: string;
  content: string;
  level: number;
  targets: string;
  is_enabled: boolean;
  is_public: boolean;
  created_at: number;
}
