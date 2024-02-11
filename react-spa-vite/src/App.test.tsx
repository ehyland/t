import {
  render,
  screen,
  userEvent,
  beforeEach,
  describe,
  expect,
  it,
} from "~/test-utils";

import App from "./App";

describe("<App />", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders a button with count set to 0", () => {
    expect(screen.getByRole("button")).toHaveTextContent("count is 0");
  });

  describe("when the button is clicked", () => {
    beforeEach(async () => {
      await userEvent.click(screen.getByRole("button"));
    });

    it("increments the counter", () => {
      expect(screen.getByRole("button")).toHaveTextContent("count is 1");
    });
  });
});
