# solid-boundaries

A utility to track the boundaries of html-elements in solid-js

## What does it do?

See it in action [here](TODO)!

This small library exposes a small reactive primitive which tracks the _boundaries_ of a specific html-element (subject). A _boundary_ is in essence an object with the following structure:

```ts
interface Bounds {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}
```

A boundary updates in response to:

- scrolling - the entire window as well as (nested-)scroll-containers
- resizing - the entire window as well as the subject
- mutations in the document - to be more specific:
  - any changes that may affect styling (style/class attributes)
  - adding or removal of other html-elements

## Install

```bash
npm install solid-boundaries
```

## Usage

```tsx
import { createBoundaryTracker } from "solid-boundaries";
function App() {
  // Create a 'tracker' inside your component
  const tracker = createBoundaryTracker();

  // Make sure to pass the ref properly to the element you
  // want to track, and do something with fun with the bounds!
  // Note: the bounds are `null` when the element has not been
  // connected to the DOM yet.
  return (
    <div ref={tracker.ref}>
      {tracker.bounds() && JSON.stringify(tracker.bounds())}
    <div>
  )
}
```

## API

```tsx
interface Bounds {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface Config {
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

type TrackerProps = {
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

function createBoundaryTracker(config?: Config): TrackerProps;
```
