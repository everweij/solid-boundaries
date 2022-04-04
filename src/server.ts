import { createSignal } from "solid-js";
import type { TrackBoundsConfig, TrackBoundsProps } from "./types";
import type { Bounds, BoundsKeys } from "./bounds";
export type { Bounds, TrackBoundsConfig, TrackBoundsProps, BoundsKeys };

export function createBoundaryTracker(
  _config: TrackBoundsConfig = {}
): TrackBoundsProps {
  const [element, setElement] = createSignal<HTMLElement | null>(null);
  const [bounds] = createSignal<Bounds | null>(null);

  return {
    bounds,
    ref: setElement,
    element
  };
}
