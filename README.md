<p align="center">
  <img width="100" src="https://www.solidjs.com/img/logo/without-wordmark/logo.svg">
</p>

<h1 align="center" style="font-weight: 700;">solid-boundaries</h1>

<p align="center">
  Helps you to track the size and position of html-elements in solid-js.
</p>

<br/>

## What does it do?

See it in action [here](https://7j26ix.sse.codesandbox.io/), or see it on [CodeSandbox](https://codesandbox.io/s/solid-boundaries-example-7j26ix?file=/src/main.tsx)!

This small library exposes a small reactive primitive which tracks the **size** and **position** (_bounds_) of a specific html-element (subject). _Bounds_, just like when you call `.getBoundingClientRect()`, have the following structure:

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

This is useful for all kinds of things, like building tooltips, popovers, or other behavior and interactions related to changes regarding size and positions.

Bounds update in response to:

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
import { trackBounds } from "solid-boundaries";

function App() {
  const { ref, bounds } = trackBounds();

  // Make sure to pass the ref properly to the element you
  // want to track, and do something with fun with the bounds!
  // Note: the bounds are `null` when the element has not been
  // connected to the DOM yet.
  return (
    <div ref={ref}>
      {bounds() && JSON.stringify(bounds())}
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

type TrackBoundsProps = {
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

function trackBounds(config?: Config): TrackBoundsProps;
```

## Browser compatibility

This library makes use of `ResizeObserver` and `MutationObserver`. If you need to support older browsers I recommend to use a polyfill, otherwise certain behavior will be skipped.

## Contributing

Want to contribute to solid-boundaries? Your help is very much appreciated!
Please consult the [contribution guide](./CONTRIBUTING.MD) on how to get started.

## License

MIT © [everweij](https://github.com/everweij)
