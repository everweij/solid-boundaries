import type { PropsWithChildren } from "solid-js";
import { Show, createSignal } from "solid-js";
import { createBoundaryTracker } from "../src";
import { storeBounds, checkBounds, render, unmount } from "./helper";

const Container = (props: PropsWithChildren) => (
  <div
    id="container"
    style={{
      height: "200vh",
      display: "flex",
      "flex-direction": "column",
      "align-items": "flex-start"
    }}
  >
    {props.children}
  </div>
);

const Scrollable = (
  props: PropsWithChildren<{
    id: string;
    color: string;
    height: number;
    width: number;
  }>
) => (
  <div
    id={props.id}
    style={{
      overflow: "auto",
      height: props.height + "px",
      width: props.width + "px",
      "background-color": props.color,
      "padding-left": props.width / 10 + "px",
      "padding-top": props.height / 10 + "px"
    }}
  >
    <div
      style={{ height: props.height * 2 + "px", width: props.width * 2 + "px" }}
    >
      {props.children}
    </div>
  </div>
);

function Box(props: {
  id: string;
  color: string;
  large?: boolean;
  right?: boolean;
}) {
  const tracker = createBoundaryTracker();

  storeBounds(props.id, tracker.bounds);

  return (
    <div
      ref={tracker.ref}
      id={props.id}
      style={{
        width: props.large ? "200px" : "100px",
        height: props.large ? "200px" : "100px",
        "background-color": props.color,
        color: "white",
        "align-self": props.right ? "flex-end" : "flex-start"
      }}
    >
      <strong>{props.id}</strong>
      <pre style={{ "font-size": "8px" }}>
        <code>{JSON.stringify(tracker.bounds(), null, 2)}</code>
      </pre>
    </div>
  );
}

function Test() {
  const [testMutation, setTestMutation] = createSignal(false);
  const [testResize, setTestResize] = createSignal(false);

  return (
    <Container>
      <button
        id="toggle-mutation"
        onClick={() => setTestMutation(!testMutation())}
      >
        toggle-mutation
      </button>
      <button id="toggle-resize" onClick={() => setTestResize(!testResize())}>
        toggle-resize
      </button>
      <Show when={testMutation()}>
        <Box id="box-1" color="blue" />
      </Show>
      <Box id="box-2" color="purple" large={testResize()} />
      <Box id="box-3" color="pink" right />
      <Scrollable id="scroll-1" width={400} height={400} color="lightgrey">
        <Box id="box-4" color="green" />
        <Scrollable id="scroll-2" width={240} height={240} color="grey">
          <Box id="box-5" color="orange" />
        </Scrollable>
      </Scrollable>
    </Container>
  );
}

beforeEach(() => {
  unmount?.();

  cy.scrollTo("topLeft");
  cy.get("#scroll-1").scrollTo("topLeft");
  cy.get("#scroll-2").scrollTo("topLeft");

  render(() => <Test />);
});

describe("createBoundaryTracker", () => {
  it("measures the bounds of the boxes correctly after first mount", () => {
    checkBounds();
  });

  it("measures the bounds of the boxes correctly when a box gets added and removed", () => {
    checkBounds("after mount");

    cy.get("#toggle-mutation").click();
    checkBounds("after adding box 1");

    cy.get("#toggle-mutation").click();
    checkBounds("after removing box 1");
  });

  it("measures the bounds of the boxes correctly when a box gets resized", () => {
    checkBounds("after mount");

    cy.get("#toggle-resize").click();
    checkBounds("after making box 2 larger");

    cy.get("#toggle-resize").click();
    checkBounds("after making box 2 small again");
  });

  it("measures the bounds of the boxes correctly when a user scrolls", () => {
    checkBounds("after mount");

    cy.scrollTo("center");
    checkBounds("after scrolling body to center");

    cy.get("#scroll-1").scrollTo("bottom");
    checkBounds("after scrolling first scroll-container to center");

    cy.get("#scroll-2").scrollTo("bottom");
    checkBounds("after scrolling second scroll-container to center");
  });

  it("measures the bounds of the boxes correctly the window gets resized", () => {
    checkBounds("after mount");

    cy.viewport(800, 600);
    checkBounds("after resizing window to 800x600");
  });
});
