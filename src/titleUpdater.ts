// Copyright (c) 2020 WiseTime. All rights reserved.

import * as vscode from 'vscode';

let didChange = false;

const updateTitle = (
    getTitle: () => string,
    setTitle: (t: string) => Thenable<void>,
) => (
    branchName: string | undefined
): Thenable<void> => {
    const currentTitle = getTitle();
    const newTitle = makeTitle(currentTitle, branchName);
    if (newTitle !== currentTitle) {
      return setTitle(newTitle);
    }
    return Promise.resolve();
};

export default updateTitle;

const makeTitle = (currentTitle: string, branchName: string | undefined): string => {
  let branchTemplate = vscode.workspace
    .getConfiguration('branchInWindowTitle')
    .get('branchTemplate') as string;

  const branchTemplateRegEx = new RegExp(branchTemplate.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&").replace('\\$branchName', '([^\\]]*)'));
  if (!branchTemplateRegEx.test(branchTemplate)) {
    // Fail if generated template regex do not match template
    return currentTitle;
  }

  let newTitle = currentTitle.valueOf();
  let branch = branchTemplateRegEx.exec(newTitle);
  if (branch) {
    newTitle = newTitle.replace(branch[0], branchName ? branch[0].replace(branch[1], branchName) : '');
  } else {
    if (didChange) {
      // We changed the title but it no longer match the pattern
      return currentTitle;
    }

    newTitle = newTitle + (branchName ? branchTemplate.replace('$branchName', branchName) : '');
  }

  if (branchName) {
    didChange = true;
  } else {
    didChange = false;
  }

  return newTitle;
};
