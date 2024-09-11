import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import "whatwg-fetch";
import MainPage from "../components/MainPage/MainPage";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: () => null,
    };
  },
  useParams() {},
}));

describe("MainPage component", () => {
  const locale = "en";
  const messages = require(`../../messages/${locale}.json`);

  test("renders loading spinner when user is loading", async () => {
    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <MainPage />
      </NextIntlClientProvider>,
    );
    const spinnerElement = document.querySelector(".spinner");
    expect(spinnerElement).toBeInTheDocument();
  });

  test("renders sign-in and sign-up links when user is not authenticated", async () => {
    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <MainPage />
      </NextIntlClientProvider>,
    );
    const spinnerElement = document.querySelector(".spinner");
    expect(spinnerElement).toBeInTheDocument();
    await waitFor(() => {
      expect(document.querySelectorAll(".link")).toHaveLength(2);
    });
  });
});
