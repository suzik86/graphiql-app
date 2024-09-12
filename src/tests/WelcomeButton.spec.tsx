import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import WelcomeButton from "../components/WelcomeButton/WelcomeButton";

describe("WelcomeButton component", () => {
  test("renders correctly with given props", () => {
    const to = "/example";
    const text = "Click Me";

    render(<WelcomeButton to={to} text={text} />);

    const linkElement = screen.getByText(text);

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", to);
    expect(linkElement).toHaveClass("btn");
  });

  test("renders correctly when provided an empty string as text", () => {
    const to = "/example";
    const text = "";

    render(<WelcomeButton to={to} text={text} />);

    const linkElement = screen.getByRole("link");

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", to);
    expect(linkElement).toHaveClass("btn");
    expect(linkElement).toBeEmptyDOMElement();
  });
});
