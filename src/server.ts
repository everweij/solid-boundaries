import { createSignal } from "solid-js";
import type {
  CreateBoundaryTrackerConfig,
  CreateBoundaryTrackerReturn
} from "./types";
import type { Bounds } from "./bounds";
export type {
  Bounds,
  CreateBoundaryTrackerReturn,
  CreateBoundaryTrackerConfig
};

export function createBoundaryTracker(
  _config: CreateBoundaryTrackerConfig = {}
): CreateBoundaryTrackerReturn {
  const [element, setElement] = createSignal<HTMLElement | null>(null);
  const [bounds] = createSignal<Bounds | null>(null);

  return {
    bounds,
    ref: setElement,
    element
  };
}
