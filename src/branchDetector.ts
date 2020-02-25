// Copyright (c) 2020 WiseTime. All rights reserved.

import * as vscode from 'vscode';

class BranchDetector implements vscode.Disposable {
  private intervalId: NodeJS.Timeout;

  constructor(projectRootPath: string, onBranch: (branchName: string | undefined) => void, pollInterval: number) {
    const headFile = projectRootPath + '/.git/HEAD';
    this.getBranchName(headFile).then(onBranch);
    this.intervalId = setInterval(() => {
      this.getBranchName(headFile).then(onBranch);
    }, pollInterval);
  }

  dispose(): void {
    clearInterval(this.intervalId);
  }

  private async getBranchName(headFilePath: string): Promise<string | undefined> {
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
 * @param pollInterval Interval in milliseconds for file system polling. Defaults to 5000.
 * @return A disposable that stops branch detection when disposed.
 */
export default function detectBranch(
  projectRootPath: string,
  onBranch: (branchName: string | undefined) => void,
  pollInterval: number = 3000
): vscode.Disposable {
  return new BranchDetector(projectRootPath, onBranch, pollInterval);
}
