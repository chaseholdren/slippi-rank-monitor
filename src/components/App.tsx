import { Player } from '#/components/Player';
import { useAppState } from '#/store';
import { getFolderWatcher } from '#/utils/getFolderWatcher';
import { Box } from 'ink';
import { useEffect, useMemo } from 'react';

let folderWatcher: ReturnType<typeof getFolderWatcher>;

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received.');
  await folderWatcher?.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received.');
  await folderWatcher?.close();
  process.exit(0);
});

export const App = () => {
  const addReplayFile = useAppState((state) => state.addReplayFile);
  const replayFiles = useAppState((state) => state.replayFiles);

  useEffect(() => {
    folderWatcher = getFolderWatcher(Bun.env.SLIPPI_REPLAY_FOLDER);

    folderWatcher.on('add', (filepath) => {
      try {
        addReplayFile(filepath);
      } catch {}
    });

    return () => {
      folderWatcher.close();
    };
  }, [addReplayFile]);

  const uniqueUserIds = useMemo(() => {
    const userIds = new Set<string>();
    replayFiles.forEach((replayFile) => {
      replayFile.players.forEach((player) => {
        if (!Bun.env.SLIPPI_IGNORE_CONNECT_CODE.includes(player.connectCode.toUpperCase())) {
          userIds.add(player.userId);
        }
      });
    });
    return userIds;
  }, [replayFiles]);

  return (
    <Box flexDirection='column' gap={1}>
      {Array.from(uniqueUserIds).map((playerId) => (
        <Player key={playerId} userId={playerId} />
      ))}
    </Box>
  );
};
