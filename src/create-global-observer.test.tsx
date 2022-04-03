import { createEffect, createRoot, onCleanup } from "solid-js";
import { describe, it, fn, expect, beforeEach } from "vitest";
import type { RegisterFn } from "./create-global-observer";
import { createGlobalObserver } from "./create-global-observer";

const nextTick = () => new Promise(resolve => setTimeout(resolve, 1000 / 60));

class MockObserver<T> {
  observedItems: T[] = [];
  constructor(private handler: (items: T[]) => void) {}

  observe(item: T) {
    this.observedItems.push(item);
  }

  disconnect() {
    this.observedItems = [];
  }

  trigger() {
    if (this.observedItems.length) {
      this.handler(this.observedItems);
    }
  }
}

const item = {};
type Item = typeof item;

describe("createGlobalObserver", () => {
  let register: RegisterFn<Item>;
  let subject: MockObserver<Item>;

  beforeEach(() => {
    register = createGlobalObserver<Item, MockObserver<Item>>({
      init: handler => {
        subject = new MockObserver(handler);
        return subject;
      },
      connect: subject => subject.observe(item),
      disconnect: subject => subject.disconnect()
    });
  });

  it("lets you register a callback and immediately starts listening to the subject", () => {
    const callback = fn();

    return createRoot(async dispose => {
      createEffect(() => register(callback));

      await nextTick();

      subject.trigger();

      expect(callback).toHaveBeenCalled();
      dispose();
    });
  });

  it("does not observe anything when no handlers have been registered yet", () => {
    expect(subject.observedItems).toEqual([]);
  });

  it("unregisters the callback on cleanup", () => {
    const callback = fn();

    return createRoot(async dispose => {
      createEffect(() => onCleanup(register(callback)));

      await nextTick();

      dispose();
      subject.trigger();

      expect(callback).not.toHaveBeenCalled();
      expect(subject.observedItems).toEqual([]);
    });
  });

  it("calls multiple callbacks", () => {
    const callback1 = fn();
    const callback2 = fn();

    return createRoot(async dispose => {
      createEffect(() => onCleanup(register(callback1)));
      createEffect(() => onCleanup(register(callback2)));

      await nextTick();

      subject.trigger();

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();

      dispose();
    });
  });
});
