/**
 * @jest-environment jsdom
 * @jest-environment-options { "resources": "usable", "runScripts": "dangerously" }
 */
import "@testing-library/jest-dom";
import { render, screen, waitFor, act, cleanup } from "@testing-library/react";
import waitForExpect from "wait-for-expect";
import RequestHandler from "../components/RestClient/RequestHandler";
import { NextIntlClientProvider } from "next-intl";
import {
  createScriptsObserver,
  getLoadedScripts,
  mockForMonaco,
  revertMockForMonaco,
  ScriptsObserver,
} from "../utils/test-util";
import React from "react";
import fetchMock from "jest-fetch-mock";
import { handleClientError, handleServerError } from "../utils/errorHandlers";
waitForExpect.defaults.timeout = 8000;
waitForExpect.defaults.interval = 10;

fetchMock.enableMocks();

let scriptsObserver: ScriptsObserver;

const messages = {
  Rest: {
    response: "Response",
    status: "Status",
    Body: "Body",
    send: "Send Request",
  },
};

const mockHeaders = [
  { key: "Authorization", value: "Bearer token", included: true },
  { key: "Content-Type", value: "application/json", included: true },
];

const mockVariables = [{ key: "userId", value: "123", included: true }];

describe("RequestHandler", () => {
  const ref = React.createRef<{ sendRequest: () => void }>();
  const setup = (props = {}) => {
    const defaultProps = {
      method: "POST",
      endpoint: "/test-endpoint",
      headers: mockHeaders,
      body: { userId: "{{userId}}" },
      editorMode: "json" as "json" | "text",
      variables: mockVariables,
    };

    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <RequestHandler {...defaultProps} {...props} ref={ref} />
      </NextIntlClientProvider>,
    );
  };

  beforeAll(() => {
    mockForMonaco();
  });

  beforeEach(() => {
    scriptsObserver = createScriptsObserver();
    fetchMock.resetMocks();
    cleanup();
  });

  afterAll(() => {
    revertMockForMonaco();
  });

  test("renders the component with initial props", async () => {
    await act(async () => {
      setup();
      getLoadedScripts(scriptsObserver.getScriptStatus());
    });
    waitFor(async () => {
      const editor = await screen.findByRole("textbox");
      expect(editor).toBeInTheDocument();
    });
  });

  test("handles server errors correctly", async () => {
    fetchMock.mockClear();
    const serverErrorStatusCodes = [500, 502, 503, 504];
    const expectedServerMessages = [
      "Server Error: Internal Server Error",
      "Server Error: Bad Gateway",
      "Server Error: Service Unavailable",
      "Server Error: Gateway Timeout",
    ];

    for (let i = 0; i < serverErrorStatusCodes.length; i++) {
      fetchMock.mockResponseOnce(expectedServerMessages[i], {
        status: serverErrorStatusCodes[i],
      });

      act(() => {
        setup();
      });

      ref.current?.sendRequest();

      await waitFor(() => {
        expect(
          screen.findByDisplayValue(expectedServerMessages[i]),
        ).resolves.toBeInTheDocument();
      });
    }
  });

  test("sends request successfully and displays response", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }), {
      status: 200,
    });

    act(() => {
      setup();
    });

    act(() => {
      ref.current?.sendRequest();
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/POST/L3Rlc3QtZW5kcG9pbnQ=/eyJ1c2VySWQiOiIxMjMifQ==?Authorization=Bearer%20token&Content-Type=application%2Fjson",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ userId: "123" }),
        }),
      );
    });

    const response = screen.getByText("Response");
    expect(response).toBeInTheDocument();
  });

  test("replaces placeholders correctly in the request body", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }), {
      status: 200,
    });

    const props = {
      body: { userId: "{{userId}}" },
      variables: [{ key: "userId", value: "456", included: true }],
    };

    act(() => {
      setup(props);
    });

    act(() => {
      ref.current?.sendRequest();
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/POST/L3Rlc3QtZW5kcG9pbnQ=/eyJ1c2VySWQiOiI0NTYifQ==?Authorization=Bearer%20token&Content-Type=application%2Fjson",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ userId: "456" }),
        }),
      );
    });
  });

  test("handles client errors correctly", async () => {
    fetchMock.mockResponseOnce("Not Found", { status: 404 });

    act(() => {
      setup();
    });

    act(() => {
      ref.current?.sendRequest();
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      expect(
        screen.findByDisplayValue("Client Error: Not Found"),
      ).resolves.toBeInTheDocument();
    });
  });

  test("handles network errors", async () => {
    fetchMock.mockRejectOnce(new Error("Network Error"));

    act(() => {
      setup();
    });

    act(() => {
      ref.current?.sendRequest();
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(
        screen.findByDisplayValue("Server Error: Unexpected"),
      ).resolves.toBeInTheDocument();
    });
  });

  test("formats JSON response correctly", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ userId: "123", name: "John Doe" }),
      { status: 200 },
    );

    act(() => {
      setup();
    });

    act(() => {
      ref.current?.sendRequest();
    });

    await waitFor(() => {
      const formattedResponse = screen.findByDisplayValue(
        JSON.stringify({ userId: "123", name: "John Doe" }, null, 2),
      );
      expect(formattedResponse).resolves.toBeInTheDocument();
    });
  });

  test("Adds the correct style class for the response status", async () => {
    fetchMock.mockClear();
    const mockStatusCodes = [
      { status: 200, className: "response__status__success", label: "Success" },
      {
        status: 404,
        className: "response__status__clientError",
        label: "Client Error",
      },
      {
        status: 500,
        className: "response__status__serverError",
        label: "Server Error",
      },
    ];

    for (const { status, className, label } of mockStatusCodes) {
      fetchMock.mockResponseOnce(label, { status });

      act(() => {
        setup();
      });

      act(() => {
        ref.current?.sendRequest();
      });

      await waitFor(() => {
        const statusCodeElement = screen.getByText(status.toString());
        expect(statusCodeElement).toBeInTheDocument();
        expect(statusCodeElement).toHaveClass(className);
      });
    }
  });

  test("Should return the correct client error message", () => {
    const clientErrorCases = [
      { status: 400, message: "Client Error: Bad Request" },
      { status: 401, message: "Client Error: Unauthorized" },
      { status: 403, message: "Client Error: Forbidden" },
      { status: 404, message: "Client Error: Not Found" },
      { status: 999, message: "Client Error: Unexpected" },
    ];

    clientErrorCases.forEach(({ status, message }) => {
      expect(handleClientError(status)).toBe(message);
    });
  });

  test("Should return the correct server error message", () => {
    const serverErrorCases = [
      { status: 500, message: "Server Error: Internal Server Error" },
      { status: 502, message: "Server Error: Bad Gateway" },
      { status: 503, message: "Server Error: Service Unavailable" },
      { status: 504, message: "Server Error: Gateway Timeout" },
      { status: 999, message: "Server Error: Unexpected" },
    ];

    serverErrorCases.forEach(({ status, message }) => {
      expect(handleServerError(status)).toBe(message);
    });
  });

  test("handles null body correctly", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }), {
      status: 200,
    });

    const props = {
      body: null,
    };

    act(() => {
      setup(props);
    });

    act(() => {
      ref.current?.sendRequest();
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/POST/L3Rlc3QtZW5kcG9pbnQ=?Authorization=Bearer%20token&Content-Type=application%2Fjson",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: "",
        }),
      );
    });
  });
  test("does not replace placeholders if no variables provided", async () => {
    const props = {
      body: { userId: "{{userId}}", name: "{{name}}" },
      variables: [],
    };

    act(() => {
      setup(props);
    });

    act(() => {
      ref.current?.sendRequest();
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/POST/L3Rlc3QtZW5kcG9pbnQ=/eyJ1c2VySWQiOiJ7e3VzZXJJZH19IiwibmFtZSI6Int7bmFtZX19In0=?Authorization=Bearer%20token&Content-Type=application%2Fjson",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ userId: "{{userId}}", name: "{{name}}" }),
        }),
      );
    });
  });

  it("applies correct CSS class for 200 status", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      text: jest.fn().mockResolvedValue("OK"),
    });

    act(() => {
      setup();
    });

    await act(async () => {
      ref.current?.sendRequest();
    });

    const statusCode = screen.getByText("200");
    expect(statusCode).toHaveClass("response__status__success");
  });
});
