import type { RankedProfile, ReplayFile } from '#/types';
import { getPlayerRankedProfile } from '#/utils/getPlayerRankedProfile';
import { SlippiGame, type PlayerType } from '@slippi/slippi-js';
import { createStore } from 'zustand';

type Config = {
  slippiReplayFolder: string;
  ignoreConnectCode?: string;
};

type StateProps = {
  config: Config;
  replayFiles: ReplayFile[];
  playersByConnectCode: Record<
    string,
    {
      isFetchingRankedData: boolean;
      rankedProfile?: RankedProfile;
      playerFromReplayFile: PlayerType;
    }
  >;
};

type Actions = {
  addReplayFile: (game: string) => void;
};

export type AppStoreState = StateProps & Actions;

export type AppStore = ReturnType<typeof createAppStore>;

export const createAppStore = (config: Config) => {
  const useAppStore = createStore<AppStoreState>()((set) => ({
    config,
    replayFiles: [],
    playersByConnectCode: {},
    addReplayFile: async (replayFile: string) => {
      const gameInfo = new SlippiGame(replayFile).getSettings();
      if (!gameInfo) return;

      set((state) => {
        state.replayFiles.push({
          filepath: replayFile,
          dateAdded: new Date(),
          ...gameInfo,
        });
        return state;
      });

      const playersToFetch = gameInfo.players.filter((player) => player.connectCode !== config.ignoreConnectCode);

      for (const playerToFetch of playersToFetch) {
        set((state) => {
          state.playersByConnectCode[playerToFetch.connectCode] = {
            playerFromReplayFile: playerToFetch,
            isFetchingRankedData: true,
          };
          return state;
        });

        getPlayerRankedProfile({ connectCode: playerToFetch.connectCode })
          .then((rankedProfile) => {
            set((state) => {
              state.playersByConnectCode[playerToFetch.connectCode].rankedProfile = rankedProfile;
              return state;
            });
          })
          .finally(() => {
            set((state) => {
              state.playersByConnectCode[playerToFetch.connectCode].isFetchingRankedData = false;
              return state;
            });
          });
      }
    },
  }));

  return useAppStore;
};
