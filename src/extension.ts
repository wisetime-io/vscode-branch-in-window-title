// Copyright (c) 2020 WiseTime. All rights reserved.

import * as vscode from 'vscode';
import detectBranch from './branchDetector';
import updateTitle from './titleUpdater';

const windowConfig = () => vscode.workspace.getConfiguration('window');
const getWindowTitle = (): string => windowConfig().get('title') as string;
const setWindowTitle = (title: string): Thenable<void> => windowConfig().update('title', title);

export function activate(context: vscode.ExtensionContext) {
  if (!vscode.workspace.workspaceFolders) {
    // No open project, no Git repository.
    return;
  }
  const projectRoot = vscode.workspace.workspaceFolders[0].uri.path;
  const pollingInterval = vscode.workspace
    .getConfiguration('branchInWindowTitle')
    .get('branchPollingInterval') as number;

  const branchDetector = detectBranch(projectRoot, pollingInterval, updateTitle(getWindowTitle, setWindowTitle));
  context.subscriptions.push(branchDetector);
}

export function deactivate() {
  updateTitle(getWindowTitle, setWindowTitle)(undefined);
}
