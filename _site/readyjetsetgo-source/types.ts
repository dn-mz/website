export interface FlightInputData {
  id: string;
  flightNumber: string;
  date: string;
}

export interface FlightDetails {
  id: string; // correlates to input id
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string; // Local time ISO
  arrivalTime: string; // Local time ISO
  duration: string;
  airline?: string;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface UserPreferences {
  ageGroup: '0-18' | '18-30' | '30-50' | '50-70' | '70+';
  chronotype: 'early_bird' | 'night_owl' | 'balanced';
  caffeine: 'avoid' | 'necessary' | 'optimized';
  alcohol: 'none' | 'relax';
  melatonin: 'natural' | 'supplements';
  lightSensitivity: 'low' | 'normal' | 'high';
}

export enum EventType {
  SLEEP = 'SLEEP',
  LIGHT = 'LIGHT', // Seek light
  DARK = 'DARK', // Avoid light
  FOOD = 'FOOD',
  CAFFEINE = 'CAFFEINE',
  ACTIVITY = 'ACTIVITY',
  FLIGHT = 'FLIGHT',
  TRANSIT = 'TRANSIT', // New event type for stopovers
}

export interface ScheduleEvent {
  time: string; // Relative or specific time description
  type: EventType;
  title: string;
  description: string;
  phase: 'PRE' | 'FLIGHT' | 'POST';
  scienceNote?: string;
}

export interface RecommendationItem {
  name: string;
  description: string;
  affiliatePlaceholder?: boolean;
}

export interface Recommendation {
  category: string;
  items: RecommendationItem[];
}

export interface ScienceLink {
  title: string;
  url: string;
  description: string;
}

export interface JetLagPlan {
  schedule: ScheduleEvent[];
  direction: 'EAST' | 'WEST' | 'NORTH_SOUTH';
  scienceLinks?: ScienceLink[];
  recommendations?: Recommendation[];
}
