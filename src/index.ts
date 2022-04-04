import {
  createSignal,
  createEffect,
  onCleanup,
  createRenderEffect,
  on
} from "solid-js";
import type { Accessor, Setter } from "solid-js";
import type { TrackBoundsConfig, TrackBoundsProps } from "./types";
import type { Bounds, BoundsKeys } from "./bounds";
import { equals, boundsFromElement } from "./bounds";
import { createUpdateThrottler } from "./create-update-throttler";
import { createGlobalObserver } from "./create-global-observer";
import type { UnregisterFn } from "./create-global-observer";
export type { Bounds, TrackBoundsProps, TrackBoundsConfig, BoundsKeys };

const hasResizeObserver = typeof ResizeObserver !== "undefined";
const hasMutationObserver = typeof MutationObserver !== "undefined";

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

const listContainsNode = (list: NodeList, element: HTMLElement | null) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i] === element || list[i].contains(element)) {
      return true;
    }
  }
  return false;
};

type TrackElementOptions = {
  onConnect?: () => void;
  onDisconnect?: () => void;
};

// Utility function which tracks and allows you to respond to when
// an element is connected / disconnected to the DOM.
function trackElementConnected(
  element: Accessor<HTMLElement | null>,
  opts: TrackElementOptions = {}
) {
  const [isConnected, setConnected] = createSignal(false);

  createRenderEffect(() => {
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
    );
  });

  return isConnected;
}

/**
 * Reactive primitive which tracks the bounds of a specific html-element
 *
 * @example
 * ```tsx
 * function App() {
 *   const { ref, bounds } = trackBounds();
 *
 *   return (
 *     <div ref={ref}>
 *       {bounds() && JSON.stringify(bounds())}
 *     </div>
 *   );
 * }
 * ```
 */
export function trackBounds({
  enabled = () => true,
  keys,
  trackMutations = true,
  trackResize = true,
  trackScroll = true,
  suppressWarnings = false
}: TrackBoundsConfig = {}): TrackBoundsProps {
  const updater = createUpdateThrottler();
  const [element, setElement] = createSignal<HTMLElement | null>(null);
  const [_bounds, setBounds] = createSignal<Bounds | null>(null);
  const isConnected = trackElementConnected(element, {
    onDisconnect: () => setBounds(null)
  });

  // Checks whether the bounds have actually changed.
  // If so, schedule an update.
  function calculateBounds() {
    const newBounds = boundsFromElement(element()!);
    const currentBounds = _bounds();
    if (!equals(newBounds, currentBounds, keys)) {
      updater(() => setBounds(newBounds));
    }
  }

  createEffect(
    on([enabled, isConnected], () => {
      // If the element is not connected, or the user has
      // not enabled tracking, we don't need to do anything.
      if (enabled() && isConnected()) {
        calculateBounds();

        // resize-observer for the local element
        let resizeObserver: ResizeObserver | null = null;
        if (trackResize && hasResizeObserver) {
          let hasTriggeredResize = false;
          resizeObserver = new ResizeObserver(() => {
            if (!hasTriggeredResize) hasTriggeredResize = true;
            else calculateBounds();
          });
          resizeObserver.observe(element()!);
        }

        // register for events that can occur somewhere in the DOM
        const unregisterers = [
          hasResizeObserver &&
            trackResize &&
            registerToBodyResizeEvents(calculateBounds),
          hasMutationObserver &&
            trackMutations &&
            registerToMutationEvents(calculateBounds),
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

  // Warning stuff...
  let hasCalledRef = false;
  let hasWarned = false;
  const bounds = suppressWarnings
    ? _bounds
    : () => {
        if (!hasCalledRef && !hasWarned) {
          console.warn(
            `trackBounds(): you are trying to read the bounds of an element but it seems that you haven't attached the 'ref' properly yet.`
          );
          hasWarned = true;
        }

        return _bounds();
      };

  return {
    bounds,
    ref: (element => {
      hasCalledRef = true;
      setElement(element);
    }) as Setter<HTMLElement | null>,
    element
  };
}
