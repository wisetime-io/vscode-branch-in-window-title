// Copyright (c) 2020 WiseTime. All rights reserved.

import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import detectBranch from '../../branchDetector';
import { TextEncoder } from 'text-encoding';

suite('Branch Detector Integration Test Suite', () => {
  const tmpProjectRoot = path.join(os.tmpdir(), "vscode-git-branch-detector.branchDetector.test");
  const gitRoot = path.join(tmpProjectRoot, ".git");

  test("branchDidChange should be called with undefined branch if the .git/HEAD file could not be read", done => {
    detectBranch(tmpProjectRoot, 100, branchName => {
      assert(branchName === undefined, 'No branch detected');
      done();
    });
  });

  test("branchDidChange should be called with undefined branch if the .git/HEAD file does contain a branch", done => {
    writeGitHeadFile(gitRoot, '3d4986953423141f971dc69a691dbd89756cccbc');  // Some commit hash.
    detectBranch(tmpProjectRoot, 100, branchName => {
      assert(branchName === undefined, 'No branch detected');
      done();
    });
  });

  test("branchDidChange should be called with the branch name if the .git/HEAD file contains a branch", done => {
    writeGitHeadFile(gitRoot, 'ref: refs/heads/master');
    detectBranch(tmpProjectRoot, 100, branchName => {
      assert(branchName === 'master', 'A branch is detected');
      done();
    });
  });

  fs.rmdirSync(tmpProjectRoot, { recursive: true });
});

function deleteGitHeadFile(gitRoot: string): void {
  try {
    fs.unlinkSync(path.join(gitRoot, 'HEAD'));
  } catch (_) {
    // Maybe the file doesn't exist.
  }
};

function writeGitHeadFile(gitDir: string, content: string): void {
  if (!fs.existsSync(gitDir)) {
    fs.mkdirSync(gitDir, { recursive: true });
  }
  const gitHeadFilePath = path.join(gitDir, 'HEAD');
  const data = new TextEncoder().encode(content);
  fs.writeFileSync(gitHeadFilePath, data);
};
