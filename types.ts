export enum AppStage {
  MODE_SELECTION = 'MODE_SELECTION',
  SETUP_TRICK_TIME = 'SETUP_TRICK_TIME',
  ACTIVE_STOPWATCH = 'ACTIVE_STOPWATCH',
}

export enum TrickMode {
  CURRENT_TIME = 'CURRENT_TIME',
  FIXED_TIME = 'FIXED_TIME',
}

export interface TimeValue {
  minutes: number;
  seconds: number;
}