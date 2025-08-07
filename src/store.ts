import type { RankedProfile, ReplayFile, WithImmer } from '#/types';
import { getPlayerRankedProfile } from '#/utils/getPlayerRankedProfile';
import { SlippiGame, type PlayerType } from '@slippi/slippi-js';
import { produce } from 'immer';
import { create, type StoreApi, type UseBoundStore } from 'zustand';

type State = {
  slippiReplayFolder: string;
  ignoreConnectCode?: string;

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

let useAppState: UseBoundStore<WithImmer<StoreApi<State & Actions>>>;

type InitialState = Partial<State> & Required<Pick<State, 'slippiReplayFolder'>>;

export function intializeAppState(initialState: InitialState) {
  if (typeof useAppState !== 'undefined') {
    console.warn('App state reinitializing');
  }

  useAppState = create<State & Actions>((set) => ({
    ...initialState,
    replayFiles: [],
    playersByConnectCode: {},
    addReplayFile: (replayFile: string) => {
      const gameInfo = new SlippiGame(replayFile).getSettings();
      if (!gameInfo) return;

      set((state) =>
        produce(state, (draft) => {
          draft.replayFiles.push({
            filepath: replayFile,
            dateAdded: new Date(),
            ...gameInfo,
          });
        }),
      );

      const playersToFetch = gameInfo.players.filter((player) => player.connectCode !== initialState.ignoreConnectCode);

      for (const playerToFetch of playersToFetch) {
        set((state) =>
          produce(state, (draft) => {
            draft.playersByConnectCode[playerToFetch.connectCode] = {
              playerFromReplayFile: playerToFetch,
              isFetchingRankedData: true,
            };
            return draft;
          }),
        );

        getPlayerRankedProfile({ connectCode: playerToFetch.connectCode })
          .then((rankedProfile) => {
            set((state) =>
              produce(state, (draft) => {
                draft.playersByConnectCode[playerToFetch.connectCode].rankedProfile = rankedProfile;
                return draft;
              }),
            );
          })
          .finally(() => {
            set((state) =>
              produce(state, (draft) => {
                draft.playersByConnectCode[playerToFetch.connectCode].isFetchingRankedData = false;
                return draft;
              }),
            );
          });
      }
    },
  }));
}

export { useAppState };
