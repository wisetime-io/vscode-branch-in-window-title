// Copyright (c) 2020 WiseTime. All rights reserved.

import * as assert from 'assert';
import showCursorTitleBarNotification, { shouldShowNotification, NotificationDeps } from '../../cursorCompat';

function makeDeps(overrides: Partial<NotificationDeps> = {}): NotificationDeps {
  return {
    appName: 'Cursor',
    getTitleBarStyle: () => 'custom',
    getDismissed: () => false,
    setDismissed: () => Promise.resolve(),
    setTitleBarStyle: () => Promise.resolve(),
    showInfo: () => Promise.resolve(undefined),
    ...overrides,
  };
}

suite('Cursor Compat Test Suite', () => {

  suite('shouldShowNotification', () => {
    test('should return true when running in Cursor with non-native title bar and not dismissed', () => {
      assert.strictEqual(shouldShowNotification(makeDeps()), true);
    });

    test('should return false when not running in Cursor', () => {
      assert.strictEqual(shouldShowNotification(makeDeps({ appName: 'Visual Studio Code' })), false);
    });

    test('should return false when title bar is already native', () => {
      assert.strictEqual(shouldShowNotification(makeDeps({ getTitleBarStyle: () => 'native' })), false);
    });

    test('should return false when notification was previously dismissed', () => {
      assert.strictEqual(shouldShowNotification(makeDeps({ getDismissed: () => true })), false);
    });
  });

  suite('showCursorTitleBarNotification', () => {
    test('should not show notification when not in Cursor', () => {
      let shown = false;
      showCursorTitleBarNotification(makeDeps({
        appName: 'Visual Studio Code',
        showInfo: () => { shown = true; return Promise.resolve(undefined); },
      }));
      assert.strictEqual(shown, false);
    });

    test('should show notification when conditions are met', () => {
      let shown = false;
      showCursorTitleBarNotification(makeDeps({
        showInfo: () => { shown = true; return Promise.resolve(undefined); },
      }));
      assert.strictEqual(shown, true);
    });

    test('should set title bar to native when user clicks switch action', done => {
      let titleBarValue: string | undefined;
      showCursorTitleBarNotification(makeDeps({
        showInfo: (message, ...items) => {
          return Promise.resolve(items[0]);
        },
        setTitleBarStyle: (value) => {
          titleBarValue = value;
          return Promise.resolve();
        },
        setDismissed: () => {
          assert.strictEqual(titleBarValue, 'native');
          done();
          return Promise.resolve();
        },
      }));
    });

    test('should persist dismissal when user clicks dismiss action', done => {
      let dismissed = false;
      showCursorTitleBarNotification(makeDeps({
        showInfo: (_message, ...items) => {
          return Promise.resolve(items[1]);
        },
        setTitleBarStyle: () => {
          assert.fail('setTitleBarStyle should not be called');
          return Promise.resolve();
        },
        setDismissed: (value) => {
          dismissed = value;
          done();
          return Promise.resolve();
        },
      }));
      assert.strictEqual(dismissed, false, 'not yet dismissed before promise resolves');
    });

    test('should not persist dismissal when user closes notification without action', done => {
      let setDismissedCalled = false;
      showCursorTitleBarNotification(makeDeps({
        showInfo: () => Promise.resolve(undefined),
        setDismissed: () => {
          setDismissedCalled = true;
          return Promise.resolve();
        },
      }));
      setTimeout(() => {
        assert.strictEqual(setDismissedCalled, false);
        done();
      }, 50);
    });
  });
});
