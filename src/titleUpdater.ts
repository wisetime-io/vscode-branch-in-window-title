// Copyright (c) 2020 WiseTime. All rights reserved.

const updateTitle = (
  getTitle: () => string,
  setTitle: (t: string) => Thenable<void>,
  branchTemplate: string,
  branchNameIsPrefix: boolean,
) => (
  branchName: string | undefined
): Thenable<void> => {
    const currentTitle = getTitle();
    const newTitle = makeTitle(currentTitle, branchName, branchTemplate, branchNameIsPrefix);
    if (newTitle !== currentTitle) {
      return setTitle(newTitle);
    }
    return Promise.resolve();
  };

export default updateTitle;

const makeTitle = (
  currentTitle: string,
  branchName: string | undefined,
  branchTemplate: string,
  branchNameIsPrefix: boolean,
): string => {
  if (!branchTemplate) {
    return currentTitle;
  }

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
    let branch = (branchName ? branchTemplate.replace('$branchName', branchName) : '');
    if (branchNameIsPrefix) {
      newTitle = branch + newTitle;
    } else {
      newTitle = newTitle + branch;
    }
  }

  return newTitle;
};
