// Copyright (c) 2020 WiseTime. All rights reserved.

import * as assert from 'assert';
import updateTitle from '../../titleUpdater';

suite('Title Updater Test Suite', () => {

  test('updateTitle should append branch information to title', done => {
    const branchName = 'master';
    const branchTemplate = `\${separator}[Branch: \$branchName]`;
    const branchNameIsPrefix = false;
    const getTitle = (): string => 'wisetime.ts';
    const setTitle = (title: string): Thenable<void> => {
      assert(title === `${getTitle()}\${separator}[Branch: ${branchName}]`, 'Branch information is appended to the title');
      return Promise.resolve();
    };
    updateTitle(getTitle, setTitle, branchTemplate, branchNameIsPrefix)(branchName).then(done);
  });

  test('updateTitle should prepend branch information to title', done => {
    const branchName = 'master';
    const branchTemplate = `[Branch: \$branchName]\${separator}`;
    const branchNameIsPrefix = true;
    const getTitle = (): string => 'wisetime.ts';
    const setTitle = (title: string): Thenable<void> => {
      assert(title === `[Branch: ${branchName}]\${separator}${getTitle()}`, 'Branch information is prepended to the title');
      return Promise.resolve();
    };
    updateTitle(getTitle, setTitle, branchTemplate, branchNameIsPrefix)(branchName).then(done);
  });

  test('updateTitle should remove branch information from title if branch is undefined', done => {
    const titleWithoutBranch = 'wisetime.ts';
    const branchTemplate = `\${separator}[Branch: \$branchName]`;
    const branchNameIsPrefix = false;
    const getTitle = (): string => `${titleWithoutBranch}\${separator}[Branch: master]`;
    const setTitle = (title: string): Thenable<void> => {
      assert(title === titleWithoutBranch, 'Branch information is removed from the title');
      return Promise.resolve();
    };
    updateTitle(getTitle, setTitle, branchTemplate, branchNameIsPrefix)(undefined).then(done);
  });

  test('updateTitle should not call set title operation if the title is unchanged', done => {
    const branchName = 'master';
    const branchTemplate = `\${separator}[Branch: \$branchName]`;
    const branchNameIsPrefix = false;
    const getTitle = (): string => `wisetime.ts\${separator}[Branch: ${branchName}]`;
    const setTitle = (title: string): Thenable<void> => {
      assert(false, 'setTitle should not be called');
      return Promise.resolve();
    };
    updateTitle(getTitle, setTitle, branchTemplate, branchNameIsPrefix)(branchName).then(done);
  });

  test('updateTitle should not alter the title if template does not match', done => {
    const branchName = 'master';
    const branchTemplate = `\${separator}[Branch: \$branchName]`;
    const branchNameIsPrefix = false;
    const getTitle = (): string => `[master] wisetime.ts`;
    const setTitle = (title: string): Thenable<void> => {
      assert(false, 'setTitle should not be called');
      return Promise.resolve();
    };
    updateTitle(getTitle, setTitle, branchTemplate, branchNameIsPrefix)(undefined).then(done);
  });
});
