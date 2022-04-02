import { render } from "solid-js/web";
import { createBoundaryTracker } from "..";
import { createEffect, createSignal } from "solid-js";
import type { Accessor } from "solid-js";

function App2() {
  const [isOpen, setOpen] = createSignal(false);

  const trigger = createBoundaryTracker({
    enabled: isOpen
  });

  const layer = createBoundaryTracker({
    enabled: isOpen,
    keys: ["width", "height"]
  });

  const hasAllBounds = () => trigger.bounds() && layer.bounds();

  const layerTransform = () => {
    if (!hasAllBounds()) {
      return "translate(0px, 0px)";
    }

    const x =
      trigger.bounds()!.left +
      trigger.bounds()!.width / 2 -
      layer.bounds()!.width / 2;
    const y = trigger.bounds()!.bottom;

    return `translate(${x}px, ${y}px)`;
  };

  return (
    <div style={{ height: "200vh", padding: "64px 128px" }}>
      <button ref={trigger.ref} onClick={() => setOpen(!isOpen())}>
        Toggle
      </button>
      {isOpen() && (
        <div
          ref={layer.ref}
          style={{
            // visibility: hasAllBounds() ? "visible" : "hidden",
            transform: layerTransform(),
            width: "200px",
            height: "200px",
            position: "fixed",
            top: 0,
            left: 0,
            "background-color": "green"
          }}
        >
          Menu
        </div>
      )}
    </div>
  );
}

type BoxProps = { color: string; active: boolean; enabled: Accessor<boolean> };

function Box(props: BoxProps) {
  const tracker = createBoundaryTracker({
    enabled: props.enabled
  });

  return (
    <div
      ref={tracker.ref}
      {...props}
      style={{
        "background-color": props.color,
        height: props.active ? "200px" : "100px",
        width: props.active ? "200px" : "100px",
        margin: "64px",
        transition: "0.3s"
      }}
    >
      {tracker.bounds() && (
        <>
          <div>x: {Math.round(tracker.bounds().left)}</div>
          <div>y: {Math.round(tracker.bounds().top)}</div>
          <div>width: {Math.round(tracker.bounds().width)}</div>
          <div>height: {Math.round(tracker.bounds().height)}</div>
        </>
      )}
    </div>
  );
}

export function App() {
  const [active, setActive] = createSignal(false);
  const [enabled, setEnabled] = createSignal(true);

  return (
    <div
      style={{
        height: "200vh",
        padding: "64px"
      }}
    >
      <button onClick={() => setActive(!active())}>Toggle Box</button>
      <button onClick={() => setEnabled(!enabled())}>
        {enabled() ? "Untrack" : "Track"}
      </button>
      <Box active={active()} color="red" enabled={enabled} />
      <Box active={!active()} color="blue" enabled={enabled} />
      <div
        style={{
          height: "500px",
          "background-color": "lightgray",
          overflow: "auto"
        }}
      >
        <div style={{ height: "5000px" }}>
          <Box active={active()} color="red" enabled={enabled} />
        </div>
      </div>
    </div>
  );
}

render(() => <App2 />, document.getElementById("root")!);
