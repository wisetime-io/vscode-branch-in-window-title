// Copyright (c) 2020 WiseTime. All rights reserved.

import * as vscode from 'vscode';
import detectBranch from './branchDetector';
import updateTitle from './titleUpdater';

const windowConfig = () => vscode.workspace.getConfiguration('window');
const getWindowTitle = () => windowConfig().get('title') as string;
const setWindowTitle = (title: string) => windowConfig().update('title', title);

export function activate(context: vscode.ExtensionContext) {
  if (!vscode.workspace.workspaceFolders) {
    // No open project, no Git repository.
    return;
  }
  const projectRoot = vscode.workspace.workspaceFolders[0].uri.path;
  const pollingInterval = vscode.workspace
    .getConfiguration('branchInWindowTitle')
    .get('branchPollingInterval') as number;
  const branchTemplate = vscode.workspace
    .getConfiguration('branchInWindowTitle')
    .get('branchTemplate') as string;
  const branchNameIsPrefix = vscode.workspace
    .getConfiguration('branchInWindowTitle')
    .get('branchNameIsPrefix') as boolean;

  const branchDetector = detectBranch(projectRoot, pollingInterval, updateTitle(getWindowTitle, setWindowTitle, branchTemplate, branchNameIsPrefix));
  context.subscriptions.push(branchDetector);
}

export function deactivate() {
  const branchTemplate = vscode.workspace
    .getConfiguration('branchInWindowTitle')
    .get('branchTemplate') as string;
  const branchNameIsPrefix = vscode.workspace
    .getConfiguration('branchInWindowTitle')
    .get('branchNameIsPrefix') as boolean;

  updateTitle(getWindowTitle, setWindowTitle, branchTemplate, branchNameIsPrefix)(undefined);
}
