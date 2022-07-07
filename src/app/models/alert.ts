// Replicate API response defined in pebbles.views.alerts.alert_fields in the backend
export interface Alert {
  target: string;
  source: string;
  status: string;
  first_seen_ts: number,
  last_seen_ts: number,
  data: any;
}
