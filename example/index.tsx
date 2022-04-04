import "./index.css";
import { render } from "solid-js/web";
import { trackBounds } from "../src";
import type { Bounds } from "../src";
import { createSignal, onMount, createEffect } from "solid-js";
import { animate } from "motion";

function BoundInfo(props: { name: string; value: number }) {
  let ref!: HTMLSpanElement;

  createEffect(prev => {
    if (prev && prev !== props.value) {
      animate(
        ref,
        {
          backgroundColor: [null, "var(--primary)", "white"],
          color: [null, "white", "black"]
        },
        { duration: 0.3 }
      );
    }
    return props.value;
  });

  return (
    <div class="data">
      <span>{props.name}:</span>{" "}
      <span ref={ref}>{Math.round(props.value)}px</span>
    </div>
  );
}

function BoundsInfo(props: { bounds: Bounds }) {
  return (
    <div class="menu-bounds">
      <BoundInfo name="top" value={props.bounds.top} />
      <BoundInfo name="left" value={props.bounds.left} />
      <BoundInfo name="right" value={props.bounds.right} />
      <BoundInfo name="bottom" value={props.bounds.bottom} />
      <BoundInfo name="width" value={props.bounds.width} />
      <BoundInfo name="height" value={props.bounds.height} />
    </div>
  );
}

function ButtonWithMenu() {
  const [isOpen, setOpen] = createSignal(false);
  const [isLarge, setLarge] = createSignal(false);

  const trigger = trackBounds({
    enabled: isOpen
  });

  const layer = trackBounds({
    enabled: isOpen,
    keys: ["width", "height"]
  });

  const hasAllBounds = () => trigger.bounds() && layer.bounds();

  const layerPosition = () => {
    if (!hasAllBounds()) {
      return { top: "0px", left: "0px" };
    }

    const { left, width, bottom } = trigger.bounds()!;
    const { width: layerWidth } = layer.bounds()!;
    return {
      left: left + width / 2 - layerWidth / 2 + "px",
      top: bottom + "px"
    };
  };

  return (
    <>
      <button
        ref={trigger.ref}
        classList={{ large: isLarge() }}
        onClick={() => setOpen(!isOpen())}
      >
        Toggle
      </button>
      {isOpen() && (
        <div
          ref={layer.ref}
          class="menu"
          onClick={() => setLarge(!isLarge())}
          style={{
            visibility: hasAllBounds() ? "visible" : "hidden",
            ...layerPosition()
          }}
        >
          <div>
            <div class="menu-title">Trigger bounds:</div>
            {trigger.bounds() && <BoundsInfo bounds={trigger.bounds()} />}
          </div>
        </div>
      )}
    </>
  );
}

function Example() {
  let scrollBox: HTMLDivElement;

  onMount(() => {
    const { width: scrollBoxWidth, height: scrollBoxHeight } =
      scrollBox.getBoundingClientRect();
    const { width: innerWidh, height: innerHeight } =
      scrollBox.children[0].getBoundingClientRect();

    scrollBox.scrollLeft = innerWidh / 2 - scrollBoxWidth / 2;
    scrollBox.scrollTop = innerHeight / 2 - scrollBoxHeight / 2;
  });

  return (
    <>
      <div class="container">
        <header>
          <a href="https://www.github.com/everweij/solid-boundaries">
            <h1>solid-boundaries</h1>
          </a>
          <p>A utility to track the bounds of html-elements in solid-js</p>
          <p>
            Scroll arround, resize the window or click on the menu to see the
            bounds changing...
          </p>
        </header>
        <main ref={scrollBox} class="scroll-box">
          <div class="inner">
            <ButtonWithMenu />
          </div>
        </main>
      </div>
      <div class="filler" />
    </>
  );
}

render(() => <Example />, document.getElementById("root")!);
