// Copyright (c) 2026 WiseTime. All rights reserved.

export interface NotificationDeps {
  appName: string;
  getTitleBarStyle: () => string | undefined;
  getDismissed: () => boolean;
  setDismissed: (value: boolean) => Thenable<void>;
  setTitleBarStyle: (value: string) => Thenable<void>;
  showInfo: (message: string, ...items: string[]) => Thenable<string | undefined>;
}

const SWITCH_ACTION = 'Use Native Title Bar';
const DISMISS_ACTION = "Don't Show Again";

export function shouldShowNotification(deps: NotificationDeps): boolean {
  return deps.appName === 'Cursor'
    && deps.getTitleBarStyle() !== 'native'
    && !deps.getDismissed();
}

export default function showCursorTitleBarNotification(deps: NotificationDeps): void {
  if (!shouldShowNotification(deps)) {
    return;
  }

  deps.showInfo(
    "Cursor's custom title bar does not display the window.title setting. " +
    'Switch to the native title bar for the branch name to appear in the window title.',
    SWITCH_ACTION,
    DISMISS_ACTION,
  ).then(selection => {
    if (selection === SWITCH_ACTION) {
      deps.setTitleBarStyle('native');
      deps.showInfo(
        'Title bar style set to native. Restart Cursor for the change to take effect.',
      );
    }
    if (selection === SWITCH_ACTION || selection === DISMISS_ACTION) {
      deps.setDismissed(true);
    }
  });
}
