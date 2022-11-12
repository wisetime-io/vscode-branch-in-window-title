// Copyright (c) 2020 WiseTime. All rights reserved.

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
  const withoutBranch = currentTitle.replace(/ \${separator} \[Branch: .*\]/, '');
  if (branchName) {
    return `${withoutBranch} \${separator} [Branch: ${branchName}]`;
  }
  return withoutBranch;
};
