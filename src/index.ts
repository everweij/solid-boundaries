import {
  createSignal,
  createEffect,
  onCleanup,
  createRenderEffect,
  on
} from "solid-js";
import type { Accessor } from "solid-js";
import type {
  CreateBoundaryTrackerConfig,
  CreateBoundaryTrackerReturn
} from "./types";
import type { Bounds } from "./bounds";
import { equals, boundsFromElement } from "./bounds";
import { createBatchUpdater } from "./create-batch-updater";
import { createGlobalObserver } from "./create-global-observer";
import type { UnregisterFn } from "./create-global-observer";
export type {
  Bounds,
  CreateBoundaryTrackerReturn,
  CreateBoundaryTrackerConfig
};

const registerToMutationEvents = createGlobalObserver<
  MutationRecord[],
  MutationObserver
>({
  init: callback => new MutationObserver(callback),
  connect: subject =>
    subject.observe(document.body, {
      attributeFilter: ["style", "class"],
      subtree: true,
      childList: true
    }),
  disconnect: subject => subject.disconnect()
});

const registerToScrollEvents = createGlobalObserver<Event>({
  connect: callback =>
    window.addEventListener("scroll", callback, { capture: true }),
  disconnect: callback =>
    window.removeEventListener("scroll", callback, { capture: true })
});

const registerToBodyResizeEvents = createGlobalObserver<
  ResizeObserverEntry[],
  ResizeObserver
>({
  init: callback => {
    let hasTriggeredResize = false;
    return new ResizeObserver(entries => {
      if (!hasTriggeredResize) hasTriggeredResize = true;
      else callback(entries);
    });
  },
  connect: subject => subject.observe(document.body),
  disconnect: subject => subject.disconnect()
});

type ElementConnectedTrackerOptions = {
  onConnect?: () => void;
  onDisconnect?: () => void;
};

const listContainsNode = (list: NodeList, element: HTMLElement | null) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i] === element || list[i].contains(element)) {
      return true;
    }
  }
  return false;
};

function createElementConnectedTracker(
  element: Accessor<HTMLElement | null>,
  opts: ElementConnectedTrackerOptions = {}
) {
  const [isConnected, setConnected] = createSignal(false);

  createRenderEffect(() =>
    onCleanup(
      registerToMutationEvents(mutations => {
        for (const mutation of mutations) {
          if (listContainsNode(mutation.addedNodes, element())) {
            setConnected(true);
            opts.onConnect?.();
            return;
          }
          if (listContainsNode(mutation.removedNodes, element())) {
            setConnected(false);
            opts.onDisconnect?.();
            return;
          }
        }
      })
    )
  );

  return isConnected;
}

export function createBoundaryTracker({
  enabled = () => true,
  keys,
  trackMutations = true,
  trackResize = true,
  trackScroll = true
}: CreateBoundaryTrackerConfig = {}): CreateBoundaryTrackerReturn {
  const updater = createBatchUpdater();
  const [element, setElement] = createSignal<HTMLElement | null>(null);
  const [bounds, setBounds] = createSignal<Bounds | null>(null);
  const isConnected = createElementConnectedTracker(element, {
    onDisconnect: () => setBounds(null)
  });

  function calculateBounds() {
    const newBounds = boundsFromElement(element()!);
    const currentBounds = bounds();
    if (!equals(newBounds, currentBounds, keys)) {
      updater(() => setBounds(newBounds));
    }
  }

  createEffect(
    on([enabled, isConnected], () => {
      if (enabled() && isConnected()) {
        calculateBounds();

        let resizeObserver: ResizeObserver | null = null;
        if (trackResize) {
          let hasTriggeredResize = false;
          resizeObserver = new ResizeObserver(() => {
            if (!hasTriggeredResize) hasTriggeredResize = true;
            else calculateBounds();
          });
          resizeObserver.observe(element()!);
        }

        const unregisterers = [
          trackResize && registerToBodyResizeEvents(calculateBounds),
          trackMutations && registerToMutationEvents(calculateBounds),
          trackScroll &&
            registerToScrollEvents(evt => {
              if ((evt.target as HTMLElement).contains(element())) {
                calculateBounds();
              }
            })
        ].filter(Boolean) as UnregisterFn[];

        onCleanup(() => {
          unregisterers.forEach(unregister => unregister());
          resizeObserver?.disconnect();
        });
      }
    })
  );

  return {
    bounds,
    ref: setElement,
    element
  };
}