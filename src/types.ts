import type { Accessor, Setter } from "solid-js";
import type { BoundsKeys, Bounds } from "./bounds";

export type CreateBoundaryTrackerReturn = {
  /**
   * Setter which should be passed to the `ref` prop of the
   * element you want to track.
   */
  ref: Setter<HTMLElement | null>;
  /**
   * The bounds of the element you are tracking.
   * Note: returns `null` if the element is not connected
   * to the DOM.
   */
  bounds: Accessor<Bounds | null>;
  /**
   * Provides a reference to the element.
   */
  element: Accessor<HTMLElement | null>;
};

export interface CreateBoundaryTrackerConfig {
  /**
   * Whether to actively track the element's position.
   * @default () => true
   */
  enabled?: Accessor<boolean>;
  /**
   * Whether to actively track mutations in the DOM.
   * @default () => true
   */
  trackMutations?: boolean;
  /**
   * Whether to actively track resizes of the element you're
   * tracking or of the entire window.
   * @default () => true
   */
  trackResize?: boolean;
  /**
   * Whether to actively track scrolling.
   * @default () => true
   */
  trackScroll?: boolean;
  /**
   * Defines specific keys of the boundary to track.
   * By default all keys are tracked.
   * @default ["top", "right", "bottom", "left", "width", "height"]
   */
  keys?: BoundsKeys;
  /**
   * Whether not to show warning messages in the console
   */
  suppressWarnings?: boolean;
}
