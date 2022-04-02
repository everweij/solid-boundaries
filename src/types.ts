import type { Accessor, Setter } from "solid-js";
import type { BoundsKeys, IBounds } from "./bounds";

export type CreateBoundaryTrackerReturn = {
  ref: Setter<HTMLElement | null>;
  bounds: Accessor<IBounds | null>;
  element: Accessor<HTMLElement | null>;
};

export interface CreateBoundaryTrackerConfig {
  enabled?: Accessor<boolean>;
  trackMutations?: boolean;
  trackResize?: boolean;
  trackScroll?: boolean;
  keys?: BoundsKeys;
}
