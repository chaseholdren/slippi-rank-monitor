import type { RankedProfile } from '#/types';

export const SLIPPI_RANKS = [
  {
    name: 'Grandmaster',
    minElo: 2192,
    requiresRegionPlacement: true,
    color: '#FFD700', // golden
  },
  {
    name: 'Master 3',
    minElo: 2350,
    color: '#8B0A1A', // dark red
  },
  {
    name: 'Master 2',
    minElo: 2275,
    color: '#E2786F', // pink
  },
  {
    name: 'Master 1',
    minElo: 2192,
    color: '#FFC0CB', // light pink
  },
  {
    name: 'Diamond 3',
    minElo: 2137,
    color: '#4682B4', // blue
  },
  {
    name: 'Diamond 2',
    minElo: 2074,
    color: '#6495ED', // blue-green
  },
  {
    name: 'Diamond 1',
    minElo: 2004,
    color: '#00BFFF', // cyan
  },
  {
    name: 'Plat 3',
    minElo: 1928,
    color: '#4169E1', // blue-purple
  },
  {
    name: 'Plat 2',
    minElo: 1843,
    color: '#8A00E6', // purple
  },
  {
    name: 'Plat 1',
    minElo: 1752,
    color: '#4B0082', // dark purple
  },
  {
    name: 'Gold 3',
    minElo: 1654,
    color: '#F8E231', // yellow
  },
  {
    name: 'Gold 2',
    minElo: 1549,
    color: '#FFD700', // golden
  },
  {
    name: 'Gold 1',
    minElo: 1436,
    color: '#F2C464', // golden yellow
  },
  {
    name: 'Silver 3',
    minElo: 1316,
    color: '#A8A8A8', // gray
  },
  {
    name: 'Silver 2',
    minElo: 1189,
    color: '#B1B1B1', // light gray
  },
  {
    name: 'Silver 1',
    minElo: 1055,
    color: '#D3D3D3', // lightest gray
  },
  {
    name: 'Bronze 3',
    minElo: 914,
    color: '#CD7F32', // brown
  },
  {
    name: 'Bronze 2',
    minElo: 766,
    color: '#8B4513', // dark brown
  },
  {
    name: 'Bronze 1',
    minElo: 0,
    color: '#FFD700', // golden
  },
];

export function getPlayerRankName(player: Pick<RankedProfile, 'ratingOrdinal' | 'dailyRegionalPlacement'>) {
  if (typeof player?.ratingOrdinal !== 'number') return;
  return SLIPPI_RANKS.find((rank) => {
    if (rank.requiresRegionPlacement) {
      return player.dailyRegionalPlacement && rank.minElo <= player.ratingOrdinal;
    }
    return rank.minElo <= player.ratingOrdinal;
  })?.name;
}
