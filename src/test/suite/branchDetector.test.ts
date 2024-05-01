// Copyright (c) 2020 WiseTime. All rights reserved.

import { before, afterEach } from 'mocha';
import * as sinon from 'sinon';
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import detectBranch from '../../branchDetector';

suite('Branch Detector Integration Test Suite', function () {
  const sandbox = sinon.createSandbox();
  const stubExecFile = () =>
    sandbox.stub(cp, "execFile").withArgs("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
  const projectRootPath = vscode.Uri.file(path.normalize(`${__dirname}/../../..`));
  const projectSubFolderPath = vscode.Uri.file(path.normalize(`${__dirname}/../../../src`));
  let branchNameFromGit: string | undefined;

  before(function (done) {
    (new Promise(
      (resolve, reject) => cp.execFile(
        "git", ["rev-parse", "--abbrev-ref", "HEAD"],
        {
          cwd: projectRootPath.fsPath,
        },
        (error, stdout, stderr) => {
          if (error) {
            reject(error);
          }
          resolve(stdout.trim());
        },
      )
    )).then(branchName => {
      if (typeof branchName === "string") {
        branchNameFromGit = branchName;
      }
      done();
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  suite('From project root path', function () {
    test('branchDidChange should be called with branchNameFromGit', function (done) {
      const x = detectBranch(projectRootPath, 100, branchName => {
        assert.ok(branchName, 'Branch name is not empty');
        assert(branchName === branchNameFromGit, 'A branch is detected');
        done();
        x.dispose();
      });
    });

    test('branchDidChange should be called with mocked git branch name', function (done) {
      const mockedBranchName = "mocked-branch-name";
      stubExecFile().yields(null, mockedBranchName);
      const x = detectBranch(projectRootPath, 100, branchName => {
        assert(branchName === mockedBranchName, 'A branch is detected');
        done();
        x.dispose();
      });
    });

    test('branchDidChange should be called with undefined when mocked git branch is undefined', function (done) {
      stubExecFile().yields(null, undefined);
      const x = detectBranch(projectRootPath, 100, branchName => {
        assert(branchName === undefined, 'No branch detected');
        done();
        x.dispose();
      });
    });

    test('branchDidChange should be called with undefined when exception is thrown', function (done) {
      const error = new Error("fatal: not a git repository (or any of the parent directories): .git");
      stubExecFile().yields(error);
      const x = detectBranch(projectRootPath, 100, branchName => {
        assert(branchName === undefined, 'No branch detected');
        done();
        x.dispose();
      });
    });
  });

  suite('From project sub folder path', function () {
    test('branchDidChange should be called with branchNameFromGit', function (done) {
      const x = detectBranch(projectSubFolderPath, 100, branchName => {
        assert.ok(branchName, 'Branch name is not empty');
        assert(branchName === branchNameFromGit, 'A branch is detected');
        done();
        x.dispose();
      });
    });

    test('branchDidChange should be called with mocked git branch name', function (done) {
      const mockedBranchName = "mocked-branch-name";
      stubExecFile().yields(null, mockedBranchName);
      const x = detectBranch(projectSubFolderPath, 100, branchName => {
        assert(branchName === mockedBranchName, 'A branch is detected');
        done();
        x.dispose();
      });
    });

    test('branchDidChange should be called with undefined when mocked git branch is undefined', function (done) {
      stubExecFile().yields(null, undefined);
      const x = detectBranch(projectSubFolderPath, 100, branchName => {
        assert(branchName === undefined, 'No branch detected');
        done();
        x.dispose();
      });
    });

    test('branchDidChange should be called with undefined when error is thrown', function (done) {
      const error = new Error("fatal: not a git repository (or any of the parent directories): .git");
      stubExecFile().yields(error);
      const x = detectBranch(projectSubFolderPath, 100, branchName => {
        assert(branchName === undefined, 'No branch detected');
        done();
        x.dispose();
      });
    });
  });
});
