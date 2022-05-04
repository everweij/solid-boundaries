import { onCleanup } from "solid-js";

type Callback = () => void;

/**
 * Utility that ensures that a task is not called more often
 * than once per frame.
 */
export function createUpdateThrottler() {
  let cancelled = false,
    isUpdating = false,
    latestCallBack: Callback | null = null;

  const updater = async (callback: Callback) => {
    latestCallBack = callback;
    if (isUpdating || cancelled) {
      return;
    }

    isUpdating = true;
    await Promise.resolve();

    if (!cancelled) {
      isUpdating = false;
      latestCallBack();
      latestCallBack = null;
    }
  };

  onCleanup(() => (cancelled = true));

  return updater;
}
