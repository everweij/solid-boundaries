import { createRoot, createSignal } from "solid-js";
import { describe, it, fn, expect, beforeEach, vi } from "vitest";

const nextTick = () => new Promise(resolve => setTimeout(resolve, 1000 / 60));

const getBoundingClientRect = fn().mockImplementation(() => {
  return {
    width: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: 0
  };
});

const fakeElement = {
  getBoundingClientRect
} as unknown as HTMLElement;

beforeEach(() => {
  getBoundingClientRect.mockClear();
});

class MockResizeObserver {
  static handler: ResizeObserverCallback;
  static trigger() {
    this.handler(null!, null!);
  }

  constructor(handler: ResizeObserverCallback) {
    MockResizeObserver.handler = handler;
  }

  observe() {
    return;
  }

  disconnect() {
    return;
  }

  unobserve() {
    return;
  }
}

class MockMutationObserver {
  static handler: MutationCallback;
  static trigger(payload: MutationRecord[]) {
    this.handler?.(payload, null!);
  }

  constructor(handler: MutationCallback) {
    MockMutationObserver.handler = handler;
  }

  observe() {
    return;
  }

  disconnect() {
    return;
  }

  unobserve() {
    return;
  }

  takeRecords() {
    return null!;
  }
}

vi.stubGlobal("ResizeObserver", MockResizeObserver);
vi.stubGlobal("MutationObserver", MockMutationObserver);

import { trackBounds } from ".";

function fakeElementConnectedMutation() {
  const addedMutation = {
    addedNodes: [fakeElement]
  } as unknown as MutationRecord;
  MockMutationObserver.trigger([addedMutation]);
}

describe("trackBounds", () => {
  it("it does not do anything untill the element is connected to the DOM", () => {
    return createRoot(async dispose => {
      const tracker = trackBounds();
      tracker.ref(fakeElement);
      await nextTick();

      expect(tracker.bounds()).toEqual(null);
      expect(fakeElement.getBoundingClientRect).not.toHaveBeenCalled();

      dispose();
    });
  });

  it("provides the bounds once the element is connected to the DOM", () => {
    return createRoot(async dispose => {
      const tracker = trackBounds();
      tracker.ref(fakeElement);
      await nextTick();

      fakeElementConnectedMutation();

      await nextTick();
      expect(tracker.bounds()).not.toBeNull();

      dispose();
    });
  });

  it("does nothing when the enabled prop is false", () => {
    return createRoot(async dispose => {
      const [enabled, setEnabled] = createSignal(false);

      const tracker = trackBounds({ enabled });
      tracker.ref(fakeElement);
      await nextTick();

      fakeElementConnectedMutation();

      await nextTick();
      expect(tracker.bounds()).toBeNull();

      setEnabled(true);

      await nextTick();
      expect(tracker.bounds()).not.toBeNull();

      dispose();
    });
  });
});
