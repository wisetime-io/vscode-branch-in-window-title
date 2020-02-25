// Copyright (c) 2020 WiseTime. All rights reserved.

import * as vscode from 'vscode';

class BranchDetector implements vscode.Disposable {
  private intervalId: NodeJS.Timeout;

  constructor(projectRootPath: string, pollingInterval: number, onBranch: (branchName: string | undefined) => void) {
    const headFile = projectRootPath + '/.git/HEAD';
    this.readBranchName(headFile).then(onBranch);
    this.intervalId = setInterval(() => {
      this.readBranchName(headFile).then(onBranch);
    }, pollingInterval);
  }

  dispose(): void {
    clearInterval(this.intervalId);
  }

  private async readBranchName(headFilePath: string): Promise<string | undefined> {
    try {
      const data = await vscode.workspace.fs.readFile(vscode.Uri.file(headFilePath));
      const content = Buffer.from(data).toString('utf8');
      if (content.startsWith('ref: refs/heads/')) {
        return content.replace(/^(ref: refs\/heads\/\.*)/, '').trim();
      }
    } catch (error) {
      // Unable to read file. Perhaps it does not exist.
    }
    return undefined;
  }
}

/**
 * Detect the project's current Git branch.
 *
 * @param projectRootPath The project root path in which we expect to find the .git directory.
 * @param onBranch A callback that is fired whenever a branch is detected or changed.
 * @param pollingInterval Interval in milliseconds for file system polling. Defaults to 3000.
 * @return A disposable that stops branch detection when disposed.
 */
export default function detectBranch(
  projectRootPath: string,
  pollingInterval: number = 3000,
  onBranch: (branchName: string | undefined) => void
): vscode.Disposable {
  return new BranchDetector(projectRootPath, pollingInterval, onBranch);
}
