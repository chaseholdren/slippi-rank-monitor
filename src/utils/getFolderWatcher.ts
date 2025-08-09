import chokidar, { type FSWatcher } from 'chokidar';
import fs from 'fs';

export function getFolderWatcher(folderPath: string): FSWatcher {
  ensureDirectoryExists(folderPath);
  const watcher = chokidar.watch(folderPath, {
    persistent: true,
    awaitWriteFinish: true,
    ignoreInitial: true,
    ignored: (file, stats) => Boolean(stats?.isFile()) && !file.endsWith('.slp'),
    depth: 10,
  });
  return watcher;
}

function ensureDirectoryExists(dirPath: string): void {
  try {
    fs.existsSync(dirPath); // Check if directory exists
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // If the directory does not exist, throw an error instead of creating it.
      throw new Error(`Directory does not exist: ${dirPath}`);
    } else {
      // Re-throw other errors
      throw error;
    }
  }
}
