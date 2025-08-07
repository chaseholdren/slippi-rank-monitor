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
  const replayFolder = useAppState((state) => state.slippiReplayFolder);
  const addReplayFile = useAppState((state) => state.addReplayFile);
  const ignoreConnectCode = useAppState((state) => state.ignoreConnectCode);
  const replayFiles = useAppState((state) => state.replayFiles);

  useEffect(() => {
    folderWatcher = getFolderWatcher(replayFolder);

    folderWatcher.on('add', (filepath) => {
      try {
        addReplayFile(filepath);
      } catch {}
    });

    return () => {
      folderWatcher.close();
    };
  }, [replayFolder, addReplayFile]);

  const uniquePlayers = useMemo(() => {
    const players = new Set<string>();
    replayFiles.forEach((replayFile) => {
      replayFile.players.forEach((player) => {
        if (player.connectCode !== ignoreConnectCode) {
          players.add(player.connectCode);
        }
      });
    });
    return players;
  }, [replayFiles, ignoreConnectCode]);

  return (
    <Box flexDirection='column' gap={1}>
      {Array.from(uniquePlayers).map((connectCode) => (
        <Player key={connectCode} connectCode={connectCode} />
      ))}
    </Box>
  );
};
