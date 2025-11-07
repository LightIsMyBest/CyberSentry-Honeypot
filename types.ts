export enum Severity {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export interface Attack {
  id: string;
  timestamp: string;
  ip: string;
  type: string;
  severity: Severity;
  country: string;
  coords: { x: number; y: number };
}

export interface SystemMetric {
  name: string;
  value: number;
}
