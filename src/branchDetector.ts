// Copyright (c) 2020 WiseTime. All rights reserved.

import * as vscode from 'vscode';

class BranchDetector implements vscode.Disposable {

  private intervalId: NodeJS.Timeout;
  private branchName: string | undefined;

  constructor(projectRootPath: string, pollingInterval: number, branchDidChange: (branchName: string | undefined) => void) {
    const headFile = projectRootPath + '/.git/HEAD';
    this.readBranchName(headFile).then(branchDidChange);
    this.intervalId = setInterval(
      () => this.readBranchName(headFile).then(b => this.callIfChanged(b, branchDidChange)),
      pollingInterval
    );
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
    } catch(_) {
      // Unable to read file. Perhaps it does not exist.
    }
    return undefined;
  }

  private callIfChanged(branchName: string | undefined, branchDidChange: (b: string | undefined) => void): void {
    if (this.branchName !== branchName) {
      this.branchName = branchName;
      branchDidChange(branchName);
    }
  };
}

/**
 * Detect the project's current Git branch.
 *
 * @param projectRootPath The project root path in which we expect to find the .git directory.
 * @param branchDidChange A callback that is fired whenever a branch is detected or changed.
 * @param pollingInterval Interval in milliseconds for file system polling. Defaults to 3000.
 * @return A disposable that stops branch detection when disposed.
 */
export default function detectBranch(
  projectRootPath: string,
  pollingInterval: number = 3000,
  branchDidChange: (branchName: string | undefined) => void
): vscode.Disposable {
  return new BranchDetector(projectRootPath, pollingInterval, branchDidChange);
}
