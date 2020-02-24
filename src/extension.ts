// Copyright (c) 2020 WiseTime. All rights reserved.

import * as vscode from 'vscode';
import { API as GitAPI, GitExtension, APIState } from './types/vscode/git'; 

export function activate(context: vscode.ExtensionContext) {

	console.log('Extension "branch-in-window-title" is active');

	const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git');
	console.log(gitExtension);

	if (gitExtension) {
		const git = gitExtension.exports.getAPI(1);
		const rootPath = vscode.workspace.rootPath;
		const repository = git.repositories[0];
		const head = repository.state.HEAD;

		console.log('git extension is available');
		console.log(git.repositories);
		console.log(head);
	}
}

export function deactivate() {}
