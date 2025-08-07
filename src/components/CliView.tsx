import { useAppContext } from '#/context.js';
import { Box } from 'ink';
import { Game } from './Game';

export const CliView = () => {
  const replayFiles = useAppContext((state) => state.replayFiles);

  return (
    <Box flexDirection='column'>
      {replayFiles.map((replayFile) => (
        <Game key={replayFile.filepath} replayFile={replayFile} />
      ))}
    </Box>
  );
};
