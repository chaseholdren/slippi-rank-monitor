import { App } from '#/components/App';
import { Option, program } from 'commander';
import { render } from 'ink';

declare global {
  namespace Bun {
    interface Env {
      SLIPPI_REPLAY_FOLDER: string;
      SLIPPI_IGNORE_CONNECT_CODE: string[];
      SLIPPI_REPLAY_FOLDER_DEPTH: number;
    }
  }
}

program
  .name('slippi-rank-monitor')
  .addOption(
    new Option('-f, --replay-folder <path>', 'Path to the replay file')
      .env('SLIPPI_REPLAY_FOLDER')
      .makeOptionMandatory(),
  )
  .addOption(
    new Option('-i, --ignore-connect-code <connect-code...>', 'Connect code to filter out').env(
      'SLIPPI_IGNORE_CONNECT_CODE',
    ),
  )
  .addOption(
    new Option('-d, --replay-folder-depth <depth>', 'How many folders deep to watch for replay files')
      .env('SLIPPI_REPLAY_FOLDER_DEPTH')
      .default(2),
  )
  .parse(process.argv);

Bun.env.SLIPPI_IGNORE_CONNECT_CODE = program
  .opts()
  .ignoreConnectCode.flatMap((cc: string) => cc.toUpperCase().split(' '));
Bun.env.SLIPPI_REPLAY_FOLDER = program.opts().replayFolder;
Bun.env.SLIPPI_REPLAY_FOLDER_DEPTH = Number(program.opts().replayFolderDepth);

render(<App />);
