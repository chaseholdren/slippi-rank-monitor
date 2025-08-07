import { CliView } from '#/components/CliView';
import { createAppStore } from '#/store';
import { getFolderWatcher } from '#/utils/getFolderWatcher';
import { program } from 'commander';
import { render } from 'ink';
import { AppContext } from './context';

program
  .requiredOption('--replay-folder <path>', 'Path to the replay file')
  .option('--ignore-connect-code <connect-code>', 'Connect code to filter out')
  .parse(process.argv);

const options = program.opts();

const appStore = createAppStore({
  slippiReplayFolder: options.replayFolder,
  ignoreConnectCode: options.ignoreConnectCode,
});

function renderAppWithStore() {
  render(
    <AppContext.Provider value={appStore}>
      <CliView />
    </AppContext.Provider>,
  );
}

renderAppWithStore();

const folderWatcher = getFolderWatcher(options.replayFolder);

folderWatcher.on('add', async (filepath) => {
  try {
    appStore.getState().addReplayFile(filepath);

    renderAppWithStore();
  } catch {}
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received.');
  await folderWatcher.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received.');
  await folderWatcher.close();
  process.exit(0);
});
