import { App } from '#/components/App';
import { intializeAppState } from '#/store';
import { program } from 'commander';
import { render } from 'ink';

program
  .requiredOption('--replay-folder <path>', 'Path to the replay file')
  .option('--ignore-connect-code <connect-code>', 'Connect code to filter out')
  .parse(process.argv);

const options = program.opts();

intializeAppState({
  slippiReplayFolder: options.replayFolder,
  ignoreConnectCode: options.ignoreConnectCode,
});

render(<App />);
