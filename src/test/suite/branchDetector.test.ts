// Copyright (c) 2020 WiseTime. All rights reserved.

import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import detectBranch from '../../branchDetector';
import { TextEncoder } from 'text-encoding';

suite('Branch Detector Integration Test Suite', () => {

  test("branchDidChange should be called with undefined branch if the .git/HEAD file could not be read", done => {
    deleteGitHeadFile();
    detectBranch(resourcesPath, 100, branchName => {
      assert(branchName === undefined, 'No branch detected');
      done();
    });
  });

  test("branchDidChange should be called with undefined branch if the .git/HEAD file does contain a branch", done => {
    writeGitHeadFile('3d4986953423141f971dc69a691dbd89756cccbc');  // Some commit hash.
    detectBranch(resourcesPath, 100, branchName => {
      assert(branchName === undefined, 'No branch detected');
      done();
    });
  });

  test("branchDidChange should be called with the branch name if the .git/HEAD file contains a branch", done => {
    writeGitHeadFile('ref: refs/heads/master');
    detectBranch(resourcesPath, 100, branchName => {
      assert(branchName === 'master', 'A branch is detected');
      done();
    });
  });

  deleteGitHeadFile();
});

const resourcesPath = `${__dirname}/../../../src/test/resources`;
const gitHeadFilePath = `${resourcesPath}/.git/HEAD`;

function deleteGitHeadFile(): void {
  try {
    fs.unlinkSync(gitHeadFilePath);
  } catch(_) {
    // Maybe the file doesn't exist.
  }
};

function writeGitHeadFile(content: string): void {
  const dir = path.dirname(gitHeadFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const uri = vscode.Uri.file(gitHeadFilePath);
  const data = new TextEncoder().encode(content);
  fs.writeFileSync(gitHeadFilePath, data);
};
