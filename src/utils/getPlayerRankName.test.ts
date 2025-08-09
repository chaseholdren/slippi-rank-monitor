import { describe, it, expect } from 'bun:test'
import { getPlayerRankName } from './getPlayerRankName';

describe('getPlayerRankName', () => {
  it('returns the correct rank for a given ratingOrdinal', () => {
    // Test lowest rank
    expect(
      getPlayerRankName({ ratingOrdinal: 0, dailyRegionalPlacement: null })
    ).toBe('Bronze 1');

    // Test a high rank
    expect(
      getPlayerRankName({ ratingOrdinal: 2350, dailyRegionalPlacement: null })
    ).toBe('Master 3');
  });

  it('returns the correct rank when requiresRegionPlacement is true', () => {
    // Grandmaster requires region placement
    expect(
      getPlayerRankName({ ratingOrdinal: 2192, dailyRegionalPlacement: 1 })
    ).toBe('Grandmaster');
    // Should not return Grandmaster if no placement
    expect(
      getPlayerRankName({ ratingOrdinal: 2192, dailyRegionalPlacement: null })
    ).not.toBe('Grandmaster');
  });

  it('returns undefined for a rating below all ranks', () => {
    expect(
      getPlayerRankName({ ratingOrdinal: -10, dailyRegionalPlacement: null })
    ).toBeUndefined();
  });
});
