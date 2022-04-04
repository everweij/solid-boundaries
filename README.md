<p style="text-align: center">
  <svg width="100 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 166 155.3"><defs><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="27.5" y1="3" x2="152" y2="63.5"><stop offset=".1" stop-color="#76b3e1"/><stop offset=".3" stop-color="#dcf2fd"/><stop offset="1" stop-color="#76b3e1"/></linearGradient><linearGradient id="b" gradientUnits="userSpaceOnUse" x1="95.8" y1="32.6" x2="74" y2="105.2"><stop offset="0" stop-color="#76b3e1"/><stop offset=".5" stop-color="#4377bb"/><stop offset="1" stop-color="#1f3b77"/></linearGradient><linearGradient id="c" gradientUnits="userSpaceOnUse" x1="18.4" y1="64.2" x2="144.3" y2="149.8"><stop offset="0" stop-color="#315aa9"/><stop offset=".5" stop-color="#518ac8"/><stop offset="1" stop-color="#315aa9"/></linearGradient><linearGradient id="d" gradientUnits="userSpaceOnUse" x1="75.2" y1="74.5" x2="24.4" y2="260.8"><stop offset="0" stop-color="#4377bb"/><stop offset=".5" stop-color="#1a336b"/><stop offset="1" stop-color="#1a336b"/></linearGradient></defs><path d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z" fill="#76b3e1"/><path d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z" opacity=".3" fill="url(#a)"/><path d="m52 35-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 26 52 35z" fill="#518ac8"/><path d="m52 35-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 26 52 35z" opacity=".3" fill="url(#b)"/><path d="M134 80a45 45 0 0 0-48-15L24 85 4 120l112 19 20-36c4-7 3-15-2-23z" fill="url(#c)"/><path d="M114 115a45 45 0 0 0-48-15L4 120s53 40 94 30l3-1c17-5 23-21 13-34z" fill="url(#d)"/></svg>
</p>

<h1 style="text-align: center; font-weight: 700;">solid-boundaries</h1>

<p style="text-align: center; margin-bottom: 48px;">
  Helps you to track the size and position of html-elements in solid-js.
</p>

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
