// Replicate API response defined in pebbles.views.alerts.alert_fields in the backend
export interface Alert {
  target: string;
  source: string;
  status: string;
  data: any;
  update_ts: number;
}
