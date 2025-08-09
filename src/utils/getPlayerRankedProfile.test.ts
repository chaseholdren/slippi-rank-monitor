import { beforeEach, describe, expect, it } from 'bun:test';
import { getPlayerRankedProfile } from './getPlayerRankedProfile';

// Manual stub for fetch
// @ts-ignore
globalThis.fetch = async () => ({ json: async () => ({}) });

describe('getPlayerRankedProfile', () => {
  const connectCode = 'TEST#123';
  const fakeProfile = {
    ratingOrdinal: 2000,
    dailyRegionalPlacement: 1,
    dailyGlobalPlacement: 2,
    ratingUpdateCount: 10,
    wins: 9,
    losses: 1,
    continent: 'NORTH_AMERICA',
    characters: [
      { character: 'FOX', gameCount: 100 },
      { character: 'FALCO', gameCount: 50 },
    ],
  };
  const fakeUser = {
    displayName: 'TestUser',
    connectCode: { code: connectCode },
    rankedNetplayProfile: fakeProfile,
  };
  const fakeResponse = {
    data: { getUser: fakeUser },
  };

  beforeEach(() => {
    // Reset stubs
    // @ts-ignore
    (globalThis.fetch as any) = async () => ({ json: async () => fakeResponse });
  });

  it('should fetch and return the ranked profile with rankName', async () => {
    let fetchCalled = false;
    // @ts-ignore
    globalThis.fetch = async () => {
      fetchCalled = true;
      return { json: async () => fakeResponse } as any;
    };
    const result = await getPlayerRankedProfile({ connectCode });
    expect(fetchCalled).toBe(true);
    expect(result).toMatchObject({
      ...fakeProfile,
      rankName: 'Plat 3',
      connectCode,
      displayName: 'TestUser',
    });
  });

  it('should set rankName to "unknown" if getPlayerRankName returns falsy', async () => {
    // @ts-ignore
    globalThis.fetch = async () => ({ json: async () => ({ data: { getUser: null } }) } as any);
    const result = await getPlayerRankedProfile({ connectCode });
    expect(result.rankName).toBe('unknown');
  });
});
