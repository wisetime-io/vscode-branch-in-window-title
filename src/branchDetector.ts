// Copyright (c) 2020 WiseTime. All rights reserved.

import * as vscode from 'vscode';
import * as path from 'path';
import { execSync } from 'child_process';

class BranchDetector implements vscode.Disposable {

  private intervalId: NodeJS.Timeout;
  private branchName: string | undefined;

  constructor(projectRootPath: string, pollingInterval: number, branchDidChange: (branchName: string | undefined) => void) {
    const gitPath = getGitPath(projectRootPath);
    this.readBranchName(gitPath).then(branchDidChange);
    this.intervalId = setInterval(
      () => this.readBranchName(gitPath).then(b => this.callIfChanged(b, branchDidChange)),
      pollingInterval
    );
  }

  dispose(): void {
    clearInterval(this.intervalId);
  }

  private async readBranchName(gitPath: string): Promise<string | undefined> {
    try {
      const gitHeadPathUri = vscode.Uri.file(gitPath);
      let gitDir = gitPath;
      // Check if .git is a file (worktree) or a directory (normal repository)
      const gitFileStat = await vscode.workspace.fs.stat(gitHeadPathUri);
      if (gitFileStat.type === vscode.FileType.File) {
        // If .git is a file, read the file to find the path to the git directory
        const gitFileData = await vscode.workspace.fs.readFile(gitHeadPathUri);
        const gitFileContents = Buffer.from(gitFileData).toString('utf8').trim();
        const match = gitFileContents.match(/gitdir:\s+(.+)$/);
        if (match && match[1]) {
          // Resolve the found path against the working tree root
          gitDir = path.resolve(path.dirname(gitPath), match[1].trim());
        } else {
          return undefined;
        }
      }

      // Adjust the path to point to the common GIT_DIR
      const headFileUri = vscode.Uri.file(path.join(gitDir, 'HEAD'));
      const data = await vscode.workspace.fs.readFile(headFileUri);
      const content = Buffer.from(data).toString('utf8');
      if (content.startsWith('ref: refs/heads/')) {
        return content.replace(/^(ref: refs\/heads\/\.*)/, '').trim();
      }
    } catch (_) {
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

function getGitPath(projectRoot: string) {
  let gitRoot = projectRoot;
  try {
    gitRoot = execSync('git rev-parse --show-toplevel', {
      cwd: projectRoot,
    }).toString().trim();
  } catch (_) {
  }
  return path.join(gitRoot, '.git');
}