import { onCleanup } from "solid-js";

/**
 * Utility that ensures that a task is not called more often
 * than once per frame.
 */
export function createUpdateThrottler() {
  let handle: number | null = null;

  const cancel = () => {
    if (handle) {
      window.cancelAnimationFrame(handle);
      handle = null;
    }
  };

  const updater = (callback: () => void) => {
    cancel();

    handle = window.requestAnimationFrame(() => {
      callback();
      handle = null;
    });
  };

  onCleanup(cancel);

  return updater;
}
