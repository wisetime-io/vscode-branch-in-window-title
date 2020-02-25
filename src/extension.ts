// Copyright (c) 2020 WiseTime. All rights reserved.

import * as vscode from 'vscode';
import detectBranch from './branchDetector';

export function activate(context: vscode.ExtensionContext) {
  if (!vscode.workspace.workspaceFolders) {
    return;
  }
  const projectRoot = vscode.workspace.workspaceFolders[0].uri.path;

  const branchDetector = detectBranch(projectRoot, (branchName) => {
    const config = vscode.workspace.getConfiguration('window');
    const currentTitleConfig = config.get('title') as string;
    const newTitleConfig = windowTitleConfig(currentTitleConfig, branchName);
    if (newTitleConfig !== currentTitleConfig) {
      config.update('title', newTitleConfig);
    }
  });

  context.subscriptions.push(branchDetector);
}

export function deactivate() { }

function windowTitleConfig(currentTitleConfig: string, branchName: string | undefined): string {
  const withoutBranch = currentTitleConfig.replace(/ \${separator} \[Branch: .*\]/, '');
  if (branchName) {
    return `${withoutBranch} \${separator} [Branch: ${branchName}]`;
  }
  return withoutBranch;
}