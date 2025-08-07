import type { RankedProfile } from '#/types';

export const SLIPPI_RANKS = [
  {
    name: 'Grandmaster',
    minElo: 2192,
    requiresRegionPlacement: true,
  },
  {
    name: 'Master 3',
    minElo: 2350,
  },
  {
    name: 'Master 2',
    minElo: 2275,
  },
  {
    name: 'Master 1',
    minElo: 2192,
  },
  {
    name: 'Diamond 3',
    minElo: 2137,
  },
  {
    name: 'Diamond 2',
    minElo: 2074,
  },
  {
    name: 'Diamond 1',
    minElo: 2004,
  },
  {
    name: 'Plat 3',
    minElo: 1928,
  },
  {
    name: 'Plat 2',
    minElo: 1843,
  },
  {
    name: 'Plat 1',
    minElo: 1752,
  },
  {
    name: 'Gold 3',
    minElo: 1654,
  },
  {
    name: 'Gold 2',
    minElo: 1549,
  },
  {
    name: 'Gold 1',
    minElo: 1436,
  },
  {
    name: 'Silver 3',
    minElo: 1316,
  },
  {
    name: 'Silver 2',
    minElo: 1189,
  },
  {
    name: 'Silver 1',
    minElo: 1055,
  },
  {
    name: 'Bronze 3',
    minElo: 914,
  },
  {
    name: 'Bronze 2',
    minElo: 766,
  },
  {
    name: 'Bronze 1',
    minElo: 0,
  },
];

export function getPlayerRankName(player: Pick<RankedProfile, 'ratingOrdinal' | 'dailyRegionalPlacement'>) {
  return SLIPPI_RANKS.find((rank) => {
    if (rank.requiresRegionPlacement) {
      return player.dailyRegionalPlacement && rank.minElo <= player.ratingOrdinal;
    }
    return rank.minElo <= player.ratingOrdinal;
  })?.name;
}
