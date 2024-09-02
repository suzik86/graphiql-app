import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import Header from "../components/Header/Header";

jest.mock("next/navigation", () => ({
  ...require("next-router-mock"),
  useParams: () => jest.fn(),
}));

describe("Header component", () => {
  const locale = "en";
  const messages = require(`../../messages/${locale}.json`);

  test("renders logo", () => {
    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Header isSticky={false} onMenuClick={() => {}} />
      </NextIntlClientProvider>,
    );
    const logoElement = document.querySelector(".header__logo");
    expect(logoElement).toBeInTheDocument();
  });

  test("renders language dropdown", () => {
    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Header isSticky={false} onMenuClick={() => {}} />
      </NextIntlClientProvider>,
    );
    const dropdownElement = document.querySelector(".header__languageDropdown");
    expect(dropdownElement).toBeInTheDocument();
  });

  test("renders sign-in and sign-up buttons when user is not logged in", () => {
    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Header isSticky={false} onMenuClick={() => {}} />
      </NextIntlClientProvider>,
    );
    const signInButton = screen.getByText("Sign in");
    const signUpButton = screen.getByText("Sign up");
    expect(signInButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });
});
