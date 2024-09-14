import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import Header from "../components/Header/Header";
import { useAuthState } from "react-firebase-hooks/auth"; 
import {  logout } from "../firebase"; 

jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));

jest.mock("../firebase", () => ({
  auth: jest.fn(),
  logout: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  ...require("next-router-mock"),
  useParams: () => jest.fn(),
}));

describe("Header component", () => {
  const locale = "en";
  const messages = require(`../../messages/${locale}.json`);
  
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  test("renders logo", () => {
    (useAuthState as jest.Mock).mockReturnValue([null, false, null]);

    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Header isSticky={false} onMenuClick={() => {}} />
      </NextIntlClientProvider>,
    );
    const logoElement = document.querySelector(".header__logo");
    expect(logoElement).toBeInTheDocument();
  });

  test("renders language dropdown", () => {
    (useAuthState as jest.Mock).mockReturnValue([null, false, null]);

    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Header isSticky={false} onMenuClick={() => {}} />
      </NextIntlClientProvider>,
    );
    const dropdownElement = document.querySelector(".header__languageDropdown");
    expect(dropdownElement).toBeInTheDocument();
  });

  test("renders sign-in and sign-up buttons when user is not logged in", () => {
    (useAuthState as jest.Mock).mockReturnValue([null, false, null]);

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

  test("logs out when the user clicks the logout button", () => {
    (useAuthState as jest.Mock).mockReturnValue([{ uid: "123" }, false, null]);

    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Header isSticky={false} onMenuClick={() => {}} />
      </NextIntlClientProvider>
    );

    const logoutButton = screen.getByText("Sign out");
    fireEvent.click(logoutButton);

    expect(logout).toHaveBeenCalled();
  });

  test("renders language dropdown", () => {
    (useAuthState as jest.Mock).mockReturnValue([null, false, null]);

    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Header isSticky={false} onMenuClick={() => {}} />
      </NextIntlClientProvider>
    );
    const dropdownElement = document.querySelector(".header__languageDropdown");
    expect(dropdownElement).toBeInTheDocument();
  });

  test("renders sign-out button when user is logged in", () => {
    (useAuthState as jest.Mock).mockReturnValue([{ uid: "123" }, false, null]);

    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Header isSticky={false} onMenuClick={() => {}} />
      </NextIntlClientProvider>
    );

    const signOutButton = screen.getByText("Sign out");
    expect(signOutButton).toBeInTheDocument();

    fireEvent.click(signOutButton);
    expect(logout).toHaveBeenCalled();
  });

  test("displays the correct language flag based on locale", () => {
    (useAuthState as jest.Mock).mockReturnValue([null, false, null]);

    const { rerender } = render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Header isSticky={false} onMenuClick={() => {}} />
      </NextIntlClientProvider>
    );

    let selectedFlag = screen.getByAltText("Selected Language");
    expect(selectedFlag).toHaveAttribute("src", expect.stringContaining("/_next/image?url=%2Fimg.jpg&w=96&q=75"));

    rerender(
      <NextIntlClientProvider messages={messages} locale="ru">
        <Header isSticky={false} onMenuClick={() => {}} />
      </NextIntlClientProvider>
    );

    selectedFlag = screen.getByAltText("Selected Language");
    expect(selectedFlag).toHaveAttribute("src", expect.stringContaining("/_next/image?url=%2Fimg.jpg&w=96&q=75"));
  });
});

