import { Position } from './position';

export interface PlayerAttributes {
  overallRank: number;
  tier: number;
  name: string;
  team: string;
  position: string;
  positionalRank: number;
  strengthOfSchedule?: number;
  pointsAboveProjection?: number;
  gamesAboveProjection: string;
  price: number;
  value: number;
  byeWeek: number;
  drafted: false;
}

export interface PositionalPlayerAttributes {
  name: string;
  team: string;
  byeWeek: number;
  value: number;
  position: Position;
}
