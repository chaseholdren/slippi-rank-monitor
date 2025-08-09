import type { RankedProfile, ReplayFile } from '#/types';
import { getPlayerRankedProfile } from '#/utils/getPlayerRankedProfile';
import { GameMode, SlippiGame, type PlayerType } from '@slippi/slippi-js';
import { produce } from 'immer';
import { create } from 'zustand';

type State = {
  replayFiles: ReplayFile[];
  playersById: Record<
    string,
    {
      isFetchingRankedData: boolean;
      rankedProfile?: RankedProfile;
    } & PlayerType
  >;
};

type Actions = {
  addReplayFile: (game: string) => void;
};

export const useAppState = create<State & Actions>((set) => ({
  replayFiles: [],
  playersById: {},
  addReplayFile: (replayFile: string) => {
    const gameInfo = new SlippiGame(replayFile).getSettings();
    if (!gameInfo || gameInfo.gameMode !== GameMode.ONLINE) return;

    const playerTypes = gameInfo.players.map((player) => player.type);
    if (!playerTypes.every((type) => type === 0)) return;

    set((state) =>
      produce(state, (draft) => {
        draft.replayFiles.push({
          filepath: replayFile,
          dateAdded: new Date(),
          ...gameInfo,
        });
      }),
    );

    const playersToFetch = gameInfo.players.filter(
      (player) => !Bun.env.SLIPPI_IGNORE_CONNECT_CODE.includes(player.connectCode.toUpperCase()),
    );

    for (const playerToFetch of playersToFetch) {
      set((state) =>
        produce(state, (draft) => {
          draft.playersById[playerToFetch.userId] = {
            ...playerToFetch,
            isFetchingRankedData: true,
          };
          return draft;
        }),
      );

      getPlayerRankedProfile({ connectCode: playerToFetch.connectCode })
        .then((rankedProfile) => {
          set((state) =>
            produce(state, (draft) => {
              // @ts-expect-error
              draft.playersById[playerToFetch.userId].isFetchingRankedData = true;
              // @ts-expect-error
              draft.playersById[playerToFetch.userId].rankedProfile = rankedProfile;
              return draft;
            }),
          );
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          set((state) =>
            produce(state, (draft) => {
              // @ts-expect-error
              draft.playersById[playerToFetch.userId].isFetchingRankedData = false;
              return draft;
            }),
          );
        });
    }
  },
}));
