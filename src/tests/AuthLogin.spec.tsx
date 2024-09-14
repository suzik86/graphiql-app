import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { NextIntlClientProvider } from "next-intl";
import Login from "../components/auth/Login/Login";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";

jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
  useParams: jest.fn(),
}));

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
    };
  };

describe("Login Component", () => {
  const locale = "en";
  const messages = require(`../../messages/${locale}.json`);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should render login form", async () => {
    (useAuthState as jest.Mock).mockReturnValue([null, false]);

    act(() => {
      render(
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Login />
        </NextIntlClientProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(messages["Login"]["title"])).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(messages["Login"]["email"])
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(messages["Login"]["password"])
      ).toBeInTheDocument();
      expect(screen.getByText(messages["Login"]["login"])).toBeInTheDocument();
    });
  });

  it("should redirect when user is authenticated", () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }));
    const mockUser = { uid: "test-user" };

    (useAuthState as jest.Mock).mockReturnValue([mockUser, false]);
    jest.mock("next/navigation", () => ({
      useRouter: () => ({
        push: mockPush,
      }),
    }));

    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Login />
      </NextIntlClientProvider>
    );
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`/${locale}`);
  });

  it("should show spinner when loading", () => {
    (useAuthState as jest.Mock).mockReturnValue([null, true]);

    const { container } = render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Login />
      </NextIntlClientProvider>
    );
    const spinner = container.querySelector(".spinner");
    expect(spinner).toBeInTheDocument();
  });

  test("should display an error notification on invalid credentials", async () => {
    const mockSignIn = signInWithEmailAndPassword as jest.Mock;

    mockSignIn.mockRejectedValueOnce({ code: "auth/invalid-credential" });

    (useAuthState as jest.Mock).mockReturnValue([null, false]);

    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Login />
      </NextIntlClientProvider>
    );

    const emailInput = screen.getByPlaceholderText(messages["Login"]["email"]);
    const passwordInput = screen.getByPlaceholderText(
      messages["Login"]["password"]
    );
    const loginBtn = screen.getByText(messages["Login"]["login"]);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Wrongpassword1!" } });

    await act(async () => {
      fireEvent.click(loginBtn);
    });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        undefined,
        "test@example.com",
        "Wrongpassword1!"
      );
    });
  });
});
