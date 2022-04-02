import { onCleanup } from "solid-js";

/**
 * Utility that ensures that a callback is not called more often
 * than once per frame.
 */
export function createBatchUpdater() {
  let handle: number | null = null;

  const cancel = () => {
    if (handle) {
      cancelAnimationFrame(handle);
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
