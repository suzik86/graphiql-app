import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import Footer from "../components/Footer/Footer";

jest.mock("next/navigation", () => ({
  ...require("next-router-mock"),
  useParams: () => jest.fn(),
}));

describe("Footer component", () => {
  const locale = "en";
  const messages = require(`../../messages/${locale}.json`);

  it("renders Github links correctly", () => {
    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Footer />
      </NextIntlClientProvider>,
    );
    const guthubLinks = document.querySelectorAll(".github");
    expect(guthubLinks).toHaveLength(3);
  });

  it("renders the copyright message correctly", () => {
    const { getByText } = render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Footer />
      </NextIntlClientProvider>,
    );

    expect(getByText("© Template by 2024")).toBeInTheDocument();
  });

  it("renders the logo correctly", () => {
    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Footer />
      </NextIntlClientProvider>,
    );
    const linkElement = document.querySelector(".logo");
    expect(linkElement).toHaveAttribute(
      "href",
      "https://rs.school/courses/reactjs",
    );
  });
});
