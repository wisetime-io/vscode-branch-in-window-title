// Copyright (c) 2020 WiseTime. All rights reserved.

import * as vscode from 'vscode';
import detectBranch from './branchDetector';

export function activate(context: vscode.ExtensionContext) {
	if (!vscode.workspace.workspaceFolders) {
		return;
	}
	const config = vscode.workspace.getConfiguration("window");
	const projectRoot = vscode.workspace.workspaceFolders[0].uri.path;

	const branchDetector = detectBranch(projectRoot, (branchName) => {
		console.log(`Detected Git branch: ${branchName}`);
		const originalTitleConfig = (config.get("title") as string).replace(/ \${separator} \[Branch: .*\]/, '');
		if (branchName) {
			config.update("title", originalTitleConfig + " ${separator} [Branch: " + branchName + "]", false);
		} else {
			config.update("title", originalTitleConfig, false);
		}
	});

	context.subscriptions.push(branchDetector);
}

export function deactivate() {}
