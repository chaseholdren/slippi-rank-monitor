import type { RankedProfile } from '#/types';
import { getPlayerRankName } from '#/utils/getPlayerRankName';

export async function getPlayerRankedProfile({ connectCode }: { connectCode: string }): Promise<RankedProfile> {
  const slippiUser = await fetch('https://internal.slippi.gg/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      origin: 'https://slippi.gg',
      referer: 'https://slippi.gg',
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    },
    body: JSON.stringify({
      operationName: 'UserProfilePageQuery',
      query: getGraphqlQuery(),
      variables: {
        cc: connectCode,
        uid: connectCode,
      },
    }),
  })
    .then((r) => r.json() as Promise<UserProfilePageQueryResponse>)
    .then((r) => r.data.getUser);
  return {
    ...slippiUser.rankedNetplayProfile,
    rankName: getPlayerRankName(slippiUser.rankedNetplayProfile) || 'unknown',
    connectCode: slippiUser.connectCode.code,
    displayName: slippiUser.displayName,
  };
}

function getGraphqlQuery() {
  return `fragment profileFields on NetplayProfile {
  id
  ratingOrdinal
  ratingUpdateCount
  wins
  losses
  dailyGlobalPlacement
  dailyRegionalPlacement
  continent
  characters {
    character
    gameCount
    __typename
  }
  __typename
}

fragment userProfilePage on User {
  fbUid
  displayName
  connectCode {
    code
    __typename
  }
  status
  activeSubscription {
    level
    hasGiftSub
    __typename
  }
  rankedNetplayProfile {
    ...profileFields
    __typename
  }
  rankedNetplayProfileHistory {
    ...profileFields
    season {
      id
      startedAt
      endedAt
      name
      status
      __typename
    }
    __typename
  }
  __typename
}

query UserProfilePageQuery($cc: String, $uid: String) {
  getUser(fbUid: $uid, connectCode: $cc) {
    ...userProfilePage
    __typename
  }
}
`;
}

interface UserProfilePageQueryResponse {
  data: {
    getUser: {
      displayName: string;
      connectCode: {
        code: string;
      };
      rankedNetplayProfile: {
        ratingOrdinal: number;
        dailyRegionalPlacement: number | null;
        dailyGlobalPlacement: number | null;
        ratingUpdateCount: number;
        wins: number;
        losses: number;
        continent: string;
        characters: {
          character: string;
          gameCount: number;
        }[];
      };
    };
  };
}
// example response
// {
//   "data": {
//     "getUser": {
//       "fbUid": "BQtywvfCDdf4oXkAIyQPwpOKRcC3",
//       "displayName": "chase",
//       "connectCode": {
//         "code": "CHAZ#100",
//         "__typename": "ConnectCode"
//       },
//       "status": "ACTIVE",
//       "activeSubscription": {
//         "level": "TIER1",
//         "hasGiftSub": false,
//         "__typename": "SubscriptionResult"
//       },
//       "rankedNetplayProfile": {
//         "id": "RANKED_SINGLES-BQtywvfCDdf4oXkAIyQPwpOKRcC3-season-3",
//         "ratingOrdinal": 1756.9989330641679,
//         "ratingUpdateCount": 235,
//         "wins": 121,
//         "losses": 114,
//         "dailyGlobalPlacement": null,
//         "dailyRegionalPlacement": null,
//         "continent": "NORTH_AMERICA",
//         "characters": [
//           {
//             "character": "FOX",
//             "gameCount": 304,
//             "__typename": "CharacterUsage"
//           },
//           {
//             "character": "DR_MARIO",
//             "gameCount": 1,
//             "__typename": "CharacterUsage"
//           },
//           {
//             "character": "FALCO",
//             "gameCount": 41,
//             "__typename": "CharacterUsage"
//           },
//           {
//             "character": "GANONDORF",
//             "gameCount": 1,
//             "__typename": "CharacterUsage"
//           },
//           {
//             "character": "MARTH",
//             "gameCount": 196,
//             "__typename": "CharacterUsage"
//           },
//           {
//             "character": "JIGGLYPUFF",
//             "gameCount": 1,
//             "__typename": "CharacterUsage"
//           },
//           {
//             "character": "CAPTAIN_FALCON",
//             "gameCount": 1,
//             "__typename": "CharacterUsage"
//           },
//           {
//             "character": "SHEIK",
//             "gameCount": 1,
//             "__typename": "CharacterUsage"
//           }
//         ],
//         "__typename": "NetplayProfile"
//       },
//       "rankedNetplayProfileHistory": [
//         {
//           "id": "RANKED_SINGLES-BQtywvfCDdf4oXkAIyQPwpOKRcC3-season-2",
//           "ratingOrdinal": 1698.0926785098898,
//           "ratingUpdateCount": 371,
//           "wins": 182,
//           "losses": 189,
//           "dailyGlobalPlacement": null,
//           "dailyRegionalPlacement": null,
//           "continent": "NORTH_AMERICA",
//           "characters": [
//             {
//               "character": "SHEIK",
//               "gameCount": 4,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "FALCO",
//               "gameCount": 61,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "PEACH",
//               "gameCount": 1,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "MARTH",
//               "gameCount": 16,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "SAMUS",
//               "gameCount": 1,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "CAPTAIN_FALCON",
//               "gameCount": 5,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "FOX",
//               "gameCount": 794,
//               "__typename": "CharacterUsage"
//             }
//           ],
//           "__typename": "NetplayProfile",
//           "season": {
//             "id": "season-2",
//             "startedAt": "2024-10-14T15:30:33.823Z",
//             "endedAt": "2025-04-21T14:17:57.718Z",
//             "name": "Season 2",
//             "status": "COMPLETED",
//             "__typename": "RankedSeason"
//           }
//         },
//         {
//           "id": "RANKED_SINGLES-BQtywvfCDdf4oXkAIyQPwpOKRcC3-season-1",
//           "ratingOrdinal": 1684.979121,
//           "ratingUpdateCount": 1188,
//           "wins": 594,
//           "losses": 594,
//           "dailyGlobalPlacement": null,
//           "dailyRegionalPlacement": null,
//           "continent": "NORTH_AMERICA",
//           "characters": [
//             {
//               "character": "FOX",
//               "gameCount": 2444,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "FALCO",
//               "gameCount": 290,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "MARTH",
//               "gameCount": 21,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "CAPTAIN_FALCON",
//               "gameCount": 5,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "LUIGI",
//               "gameCount": 1,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "JIGGLYPUFF",
//               "gameCount": 2,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "NESS",
//               "gameCount": 2,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "SHEIK",
//               "gameCount": 2,
//               "__typename": "CharacterUsage"
//             }
//           ],
//           "__typename": "NetplayProfile",
//           "season": {
//             "id": "season-1",
//             "startedAt": "2024-04-15T13:55:43.903Z",
//             "endedAt": "2024-10-14T15:30:33.823Z",
//             "name": "Season 1",
//             "status": "COMPLETED",
//             "__typename": "RankedSeason"
//           }
//         },
//         {
//           "id": "RANKED_SINGLES-BQtywvfCDdf4oXkAIyQPwpOKRcC3-beta-season-2",
//           "ratingOrdinal": 1482.366291,
//           "ratingUpdateCount": 78,
//           "wins": 38,
//           "losses": 40,
//           "dailyGlobalPlacement": null,
//           "dailyRegionalPlacement": null,
//           "continent": "NORTH_AMERICA",
//           "characters": [
//             {
//               "character": "FALCO",
//               "gameCount": 53,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "FOX",
//               "gameCount": 64,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "JIGGLYPUFF",
//               "gameCount": 8,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "MARTH",
//               "gameCount": 31,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "CAPTAIN_FALCON",
//               "gameCount": 13,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "LUIGI",
//               "gameCount": 5,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "GANONDORF",
//               "gameCount": 4,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "PEACH",
//               "gameCount": 1,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "MARIO",
//               "gameCount": 1,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "ZELDA",
//               "gameCount": 1,
//               "__typename": "CharacterUsage"
//             }
//           ],
//           "__typename": "NetplayProfile",
//           "season": {
//             "id": "beta-season-2",
//             "startedAt": "2023-07-11T20:20:52.73Z",
//             "endedAt": "2024-04-15T13:55:43.903Z",
//             "name": "Beta Season 2",
//             "status": "COMPLETED",
//             "__typename": "RankedSeason"
//           }
//         },
//         {
//           "id": "RANKED_SINGLES-BQtywvfCDdf4oXkAIyQPwpOKRcC3-beta-season",
//           "ratingOrdinal": 1643.782371,
//           "ratingUpdateCount": 168,
//           "wins": 81,
//           "losses": 87,
//           "dailyGlobalPlacement": null,
//           "dailyRegionalPlacement": null,
//           "continent": "NORTH_AMERICA",
//           "characters": [
//             {
//               "character": "MARTH",
//               "gameCount": 6,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "NESS",
//               "gameCount": 2,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "FOX",
//               "gameCount": 240,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "FALCO",
//               "gameCount": 68,
//               "__typename": "CharacterUsage"
//             },
//             {
//               "character": "CAPTAIN_FALCON",
//               "gameCount": 3,
//               "__typename": "CharacterUsage"
//             }
//           ],
//           "__typename": "NetplayProfile",
//           "season": {
//             "id": "beta-season",
//             "startedAt": "2022-12-12T17:09:03.62Z",
//             "endedAt": "2023-07-11T20:20:52.73Z",
//             "name": "Beta Season",
//             "status": "COMPLETED",
//             "__typename": "RankedSeason"
//           }
//         }
//       ],
//       "__typename": "User"
//     }
//   }
// }
