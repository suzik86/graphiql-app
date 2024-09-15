import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import "whatwg-fetch";
import MainPage from "../components/MainPage/MainPage";
import { useAuthState } from "react-firebase-hooks/auth";

jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  ...require("next-router-mock"),
  useParams: () => jest.fn(),
}));

describe("MainPage component", () => {
  const locale = "en";
  const messages = require(`../../messages/${locale}.json`);

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  test("renders loading spinner when user is loading", async () => {
    (useAuthState as jest.Mock).mockReturnValue([null, true, null]);

    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <MainPage />
      </NextIntlClientProvider>,
    );

    const spinnerElement = document.querySelector(".spinner");
    expect(spinnerElement).toBeInTheDocument();
  });

  test("renders sign-in and sign-up links when user is not authenticated", async () => {
    (useAuthState as jest.Mock).mockReturnValue([null, false, null]);

    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <MainPage />
      </NextIntlClientProvider>,
    );

    await waitFor(() => {
      expect(document.querySelectorAll(".link")).toHaveLength(2);
    });
  });
});
