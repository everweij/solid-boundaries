import { createRoot } from "solid-js";
import { describe, it, fn, expect } from "vitest";
import { createUpdateThrottler } from "./create-update-throttler";

const nextTick = () => new Promise(resolve => setTimeout(resolve, 1000 / 60));

describe("createUpdateThrottler", () => {
  it("ensures that a task is not performed more than once per frame and only the last task remains", () =>
    createRoot(async dispose => {
      const updater = createUpdateThrottler();

      let returnValue = "foo";
      const mock = fn().mockImplementation(() => returnValue);
      updater(mock);
      updater(mock);
      returnValue = "bar";
      updater(mock);

      await nextTick();

      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveLastReturnedWith("bar");

      dispose();
    }));

  it("ensures that a task is not performed after cleanup", () =>
    createRoot(async dispose => {
      const updater = createUpdateThrottler();

      const mock = fn();
      updater(mock);

      dispose();

      await nextTick();

      expect(mock).not.toHaveBeenCalled();
    }));
});
