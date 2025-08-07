import type { GameStartType } from '@slippi/slippi-js';

export type ReplayFile = GameStartType & {
  filepath: string;
  dateAdded: Date;
};

export type RankedProfile = {
  displayName: string;
  connectCode: string;
  rankName: string;
  ratingOrdinal: number;
  ratingUpdateCount: number;
  wins: number;
  losses: number;
  dailyGlobalPlacement: number | null;
  dailyRegionalPlacement: number | null;
  continent: string;
  characters: {
    character: string;
    gameCount: number;
  }[];
};
