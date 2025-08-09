import { App } from '#/components/App';
import { intializeAppState } from '#/store';
import { Option, program } from 'commander';
import { render } from 'ink';

declare global {
  namespace Bun {
    interface Env {
      SLIPPI_REPLAY_FOLDER: string;
      SLIPPI_IGNORE_CONNECT_CODE: string;
    }
  }
}

program
  .addOption(new Option('--replay-folder <path>').env('SLIPPI_REPLAY_FOLDER'))
  .description('Path to the replay file')
  .addOption(new Option('--ignore-connect-code <connect-code>').env('SLIPPI_IGNORE_CONNECT_CODE'))
  .description('Connect code to filter out')
  .parse(process.argv);

const options = program.opts();

intializeAppState({
  slippiReplayFolder: options.replayFolder,
  ignoreConnectCode: options.ignoreConnectCode,
});

render(<App />);
