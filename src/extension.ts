// Copyright (c) 2020 WiseTime. All rights reserved.

import * as vscode from 'vscode';
import detectBranch from './branchDetector';

export function activate(context: vscode.ExtensionContext) {
  if (!vscode.workspace.workspaceFolders) {
    return;
  }
  const projectRoot = vscode.workspace.workspaceFolders[0].uri.path;
  const pollingInterval = vscode.workspace
    .getConfiguration('branchInWindowTitle')
    .get('branchPollingInterval') as number;

  const branchDetector = detectBranch(projectRoot, pollingInterval, (branchName) => {
    const windowConfig = vscode.workspace.getConfiguration('window');
    const currentTitle = windowConfig.get('title') as string;
    const newTitle = windowTitle(currentTitle, branchName);
    if (newTitle !== currentTitle) {
      windowConfig.update('title', newTitle);
    }
  });

  context.subscriptions.push(branchDetector);
}

export function deactivate() { }

function windowTitle(currentTitle: string, branchName: string | undefined): string {
  const withoutBranch = currentTitle.replace(/ \${separator} \[Branch: .*\]/, '');
  if (branchName) {
    return `${withoutBranch} \${separator} [Branch: ${branchName}]`;
  }
  return withoutBranch;
}
