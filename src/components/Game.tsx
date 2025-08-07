import { Player } from '#/components/Player';
import { useAppContext } from '#/context';
import type { ReplayFile } from '#/types';
import { Box } from 'ink';

interface Props {
  replayFile: ReplayFile;
}

export function Game({ replayFile }: Props) {
  const ignoreConnectCode = useAppContext((state) => state.config.ignoreConnectCode);

  return (
    <Box flexDirection='column'>
      {replayFile.players.map((player) => {
        if (player.connectCode === ignoreConnectCode) return null;
        return <Player key={player.displayName} connectCode={player.connectCode} />;
      })}
    </Box>
  );
}
