// Copyright (c) 2020 WiseTime. All rights reserved.

import * as assert from 'assert';
import * as TypeMoq from 'typemoq';
import * as vscode from 'vscode';
import * as extension from '../../extension';

suite('Extension Integration Test Suite', () => {
  vscode.window.showInformationMessage('Start integration tests.');

  test('Detect Git Branch', async () => {
    /*
    // Set a low branch polling interval so that the test completes faster.
    const extensionConfig = vscode.workspace.getConfiguration('branchInWindowTitle');
    extensionConfig.update('branchPollingInterval', 5);

    // Open a workspace at this project's root.
    // The project should contain a ./git/HEAD file with a branch name.
    await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(__dirname + "/../../../"));
    assert(vscode.workspace.workspaceFolders, 'Workspace has been opened');

    // Activate extension.
    const extensionContextMock: TypeMoq.IMock<vscode.ExtensionContext> = TypeMoq.Mock.ofType<vscode.ExtensionContext>();
    extension.activate(extensionContextMock.object);

    await new Promise(r => setTimeout(r, 10000));

    // Verify that the window title has been updated.
    const windowConfig = vscode.workspace.getConfiguration('window');
    const newWindowTitle = windowConfig.get('title') as string;
    assert(newWindowTitle.match(/ \${separator} \[Branch: .*\]$/));
    */
  });
});
