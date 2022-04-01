import { render, cleanup, fireEvent, screen } from "solid-testing-library";
import { createSignal } from "solid-js";

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <div>The count is: {count()}</div>
      <div>
        <button onClick={() => setCount(count() + 1)}>Increment</button>
        <button onClick={() => setCount(count() - 1)}>Decrement</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </>
  );
}

describe("Counter", () => {
  afterEach(cleanup);

  it("initialises in the default state", async () => {
    render(() => <Counter />);

    await screen.findByText("The count is: 0");
  });

  it("responds correctly to the button presses", async () => {
    render(() => <Counter />);

    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByText("Increment"));
    }

    await screen.findByText("The count is: 10");

    fireEvent.click(screen.getByText("Decrement"));
    await screen.findByText("The count is: 9");

    fireEvent.click(screen.getByText("Reset"));
    await screen.findByText("The count is: 0");
  });
});
