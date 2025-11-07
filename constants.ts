import { Severity } from './types';

export const ATTACK_TYPES: string[] = [
  'SQL Injection',
  'DDoS',
  'Cross-Site Scripting (XSS)',
  'Malware Infection',
  'Phishing Attempt',
  'Brute Force Attack',
  'Man-in-the-Middle',
  'Zero-Day Exploit',
];

export const SEVERITY_LEVELS: Severity[] = [
  Severity.Low,
  Severity.Medium,
  Severity.High,
  Severity.Critical,
];

export const COUNTRIES: { name: string; coords: { x: number; y: number } }[] = [
  { name: 'USA', coords: { x: 25, y: 40 } },
  { name: 'China', coords: { x: 75, y: 40 } },
  { name: 'Russia', coords: { x: 60, y: 30 } },
  { name: 'Brazil', coords: { x: 35, y: 70 } },
  { name: 'Germany', coords: { x: 50, y: 35 } },
  { name: 'India', coords: { x: 68, y: 50 } },
  { name: 'Nigeria', coords: { x: 48, y: 55 } },
  { name: 'North Korea', coords: { x: 80, y: 38 } },
  { name: 'UK', coords: { x: 45, y: 33 } },
  { name: 'Iran', coords: { x: 62, y: 42 } },
];

export const MAX_ATTACKS_IN_FEED = 15;
