// Copyright (c) 2020 WiseTime. All rights reserved.

import * as vscode from 'vscode';
import detectBranch from './branchDetector';
import updateTitle from './titleUpdater';
import showCursorTitleBarNotification from './cursorCompat';

const windowConfig = () => vscode.workspace.getConfiguration('window');
const getWindowTitle = () => windowConfig().get('title') as string;
const setWindowTitle = (title: string) => windowConfig().update('title', title);

const CURSOR_COMPAT_DISMISSED_KEY = 'cursorTitleBarNotificationDismissed';

export function activate(context: vscode.ExtensionContext) {
  if (!vscode.workspace.workspaceFolders) {
    return;
  }
  const pollingInterval = vscode.workspace
    .getConfiguration('branchInWindowTitle')
    .get('branchPollingInterval') as number;
  const branchTemplate = vscode.workspace
    .getConfiguration('branchInWindowTitle')
    .get('branchTemplate') as string;
  const branchNameIsPrefix = vscode.workspace
    .getConfiguration('branchInWindowTitle')
    .get('branchNameIsPrefix') as boolean;

  const branchDetector = detectBranch(vscode.workspace.workspaceFolders[0].uri, pollingInterval, updateTitle(getWindowTitle, setWindowTitle, branchTemplate, branchNameIsPrefix));
  context.subscriptions.push(branchDetector);

  showCursorTitleBarNotification({
    appName: vscode.env.appName,
    getTitleBarStyle: () => windowConfig().get<string>('titleBarStyle'),
    getDismissed: () => context.globalState.get(CURSOR_COMPAT_DISMISSED_KEY, false),
    setDismissed: (value) => context.globalState.update(CURSOR_COMPAT_DISMISSED_KEY, value),
    setTitleBarStyle: (value) => windowConfig().update('titleBarStyle', value, vscode.ConfigurationTarget.Global),
    showInfo: (message, ...items) => vscode.window.showInformationMessage(message, ...items),
  });
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
