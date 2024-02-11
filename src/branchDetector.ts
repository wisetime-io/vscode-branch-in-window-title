// Copyright (c) 2020 WiseTime. All rights reserved.

import * as vscode from 'vscode';
import * as cp from "child_process";
import * as git from "contrib/microsoft/vscode/extensions/git/api/git";

class BranchDetector implements vscode.Disposable {

  private intervalId: NodeJS.Timeout;
  private branchName: string | undefined;

  constructor(projectRootPath: vscode.Uri, pollingInterval: number, branchDidChange: (branchName: string | undefined) => void) {
    this.readBranchName(projectRootPath).then(branchDidChange);
    this.intervalId = setInterval(
      () => this.readBranchName(projectRootPath).then((b) => this.callIfChanged(b, branchDidChange)),
      pollingInterval
    );
  }

  dispose(): void {
    clearInterval(this.intervalId);
  }

  private async readBranchName(headFilePath: vscode.Uri): Promise<string | undefined> {
    try {
      return this.readFromExtension(headFilePath) || await this.readFromGit(headFilePath);
    } catch (_) {
      // Unable to read file. Perhaps it does not exist.
    }
  }

  private callIfChanged(branchName: string | undefined, branchDidChange: (b: string | undefined) => void): void {
    if (this.branchName !== branchName) {
      this.branchName = branchName;
      branchDidChange(branchName);
    }
  };

  private readFromExtension(rootPath: vscode.Uri): string | undefined {
    const extension = vscode.extensions.getExtension<git.GitExtension>("vscode.git");
    if (!extension?.isActive) return undefined;

    const repository = extension.exports.getAPI(1)?.getRepository(rootPath);
    if (!repository) return undefined;

    return repository.state.HEAD?.name || undefined;
  }

  private async readFromGit(rootPath: vscode.Uri): Promise<string | undefined> {
    if (rootPath.scheme != "file") return undefined;

    return await new Promise((resolve, reject) => cp.execFile(
      "git", ["rev-parse", "--abbrev-ref", "HEAD"],
      {
        cwd: rootPath.fsPath,
      },
      (e, stdout, stderr) => resolve(stdout.trim() || undefined)
    ));
  }
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
  projectRootPath: vscode.Uri,
  pollingInterval: number = 3000,
  branchDidChange: (branchName: string | undefined) => void
): vscode.Disposable {
  return new BranchDetector(projectRootPath, pollingInterval, branchDidChange);
}
