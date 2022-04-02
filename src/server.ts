import { createSignal } from "solid-js";
import type {
  CreateBoundaryTrackerConfig,
  CreateBoundaryTrackerReturn
} from "./types";
import type { IBounds } from "./bounds";
export type {
  IBounds,
  CreateBoundaryTrackerReturn,
  CreateBoundaryTrackerConfig
};

export function createBoundaryTracker(
  _config: CreateBoundaryTrackerConfig = {}
): CreateBoundaryTrackerReturn {
  const [element, setElement] = createSignal<HTMLElement | null>(null);
  const [bounds] = createSignal<IBounds | null>(null);

  return {
    bounds,
    ref: setElement,
    element
  };
}
