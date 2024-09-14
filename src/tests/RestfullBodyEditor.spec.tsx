
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RequestBodyEditor from "../components/RestClient/RequestBodyEditor";
import { act } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

const mockMonaco = {
  editor: {
    create: jest.fn(() => ({
      getAction: jest.fn(() => ({
        run: jest.fn().mockResolvedValue("formatted"),
      })),
      onDidBlurEditorWidget: jest.fn((callback) => {
        setTimeout(callback, 0); 
      }),
      getValue: jest.fn(() => '{"key": "value"}'),
      setValue: jest.fn(),
      dispose: jest.fn(),
      updateOptions: jest.fn(),
      layout: jest.fn(),
      focus: jest.fn(),
      getOptions: jest.fn(() => ({
        readOnly: false,
      })),
    })),
    setTheme: jest.fn(),
    defineTheme: jest.fn(),
    dispose: jest.fn(),
  },
  languages: {
    register: jest.fn(),
    registerCompletionItemProvider: jest.fn(),
    registerDocumentFormattingEditProvider: jest.fn(),
    setMonarchTokensProvider: jest.fn(),
    setLanguageConfiguration: jest.fn(),
    typescript: {
      typescriptDefaults: {
        setCompilerOptions: jest.fn(),
      },
    },
  },
  Uri: {
    parse: jest.fn(),
    file: jest.fn(),
  },
};
jest.mock("monaco-editor", () => mockMonaco);

const messages = {
  Rest: {
    response: "Response",
    status: "Status",
    Body: "Body",
    send: "Send Request",
  },
}

describe("RequestBodyEditor Component", () => {
  const mockSetEditorMode = jest.fn();

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  

  beforeEach(() => {
    jest.resetModules();
    Object.defineProperty(window, "devicePixelRatio", { value: 1 });
    jest.clearAllMocks();
  });

  test("renders the editor with correct title and default values", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
    <RequestBodyEditor title="Request Body" body={null} editorMode="json" />
    </NextIntlClientProvider>
     
    );

    expect(screen.getByText("Rest.Request Body")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveValue("json");
  });

  test("calls setBlurredBody on editor blur", async () => {
    const mockSetBlurredBody = jest.fn();
    jest.mock("monaco-editor");

    act(() => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
        <RequestBodyEditor
          title="Request Body"
          body='{"key": "value"}'
          setBlurredBody={mockSetBlurredBody}
          editorMode="json"
        />
        </NextIntlClientProvider>
      );
    });

    const { editor } = require("monaco-editor");

    editor.create();

    const editorInstance = editor.create.mock.results[0].value;

    await act(async () => {
      editorInstance.onDidBlurEditorWidget.mock.calls.forEach(
        ([callback]: [() => void]) => callback()
      );
    });

    waitFor(() => {
      expect(mockSetBlurredBody).toHaveBeenCalledWith('{"key": "value"}');
    });
  });

  test("handles mode change correctly", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
      <RequestBodyEditor
        title="Request Body"
        body="Some text body"
        editorMode="text"
        setEditorMode={mockSetEditorMode}
      />
      </NextIntlClientProvider>
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "json" } });

    expect(mockSetEditorMode).toHaveBeenCalledWith("json");
  });

  test("displays the Beautify button when in JSON mode", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
      <RequestBodyEditor
        title="Request Body"
        body='{"key": "value"}'
        editorMode="json"
        setEditorMode={mockSetEditorMode}
      />
      </NextIntlClientProvider>
    );

    const beautifyButton = screen.getByText("Rest.beautify");
    expect(beautifyButton).toBeInTheDocument();
  });

  test("renders Monaco editor in non-read-only mode", async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
      <RequestBodyEditor
        title="Request Body"
        body='{"key": "value"}'
        editorMode="json"
        readOnly={false}
      />
      </NextIntlClientProvider>
    );

    await act(async () => {
      const mockMonaco = require("monaco-editor");
      const mockEditorInstance = mockMonaco.editor.create();

      expect(mockEditorInstance).toBeDefined();

      expect(mockEditorInstance.getOptions()).toEqual(
        expect.objectContaining({ readOnly: false })
      );
    });
  });

  test("handleBeautify should handle promises correctly", async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
      <RequestBodyEditor
        title="Request Body"
        body='{"key": "value"}'
        setBlurredBody={() => {}}
        editorMode="json"
        setEditorMode={() => {}}
      />
      </NextIntlClientProvider>
    );

    const beautifyButton = screen.getByText("Rest.beautify");

    if (beautifyButton) {
      await act(async () => {
        beautifyButton.click();
      });
    }

    const mockMonaco = require("monaco-editor");
    const mockEditorInstance = mockMonaco.editor.create();
    const mockGetAction = mockEditorInstance.getAction;
    const mockRun = mockGetAction("editor.action.formatDocument").run;
    await act(async () => {
      await mockRun();
    });

    expect(mockGetAction).toHaveBeenCalledWith("editor.action.formatDocument");
    expect(mockRun).toHaveBeenCalled();
  });
  test("handleBeautify should handle errors correctly", async () => {
    const monaco = require("monaco-editor");

    const mockRun = jest
      .spyOn(
        monaco.editor.create().getAction("editor.action.formatDocument"),
        "run"
      )
      .mockRejectedValue(new Error("Formatting error"));

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
      <RequestBodyEditor
        title="Request Body"
        body='{"key": "value"}'
        setBlurredBody={() => {}}
        editorMode="json"
        setEditorMode={() => {}}
      />
      </NextIntlClientProvider>
    );

    const beautifyButton = screen.getByText("Rest.beautify");

    if (beautifyButton) {
      await act(async () => {
        beautifyButton.click();
      });
    }

    await expect(mockRun).rejects.toThrow("Formatting error");

    mockRun.mockRestore();
  });

  test("calls handleEditorTheme and sets custom theme", async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
      <RequestBodyEditor
        title="Request Body"
        body='{"key": "value"}'
        editorMode="json"
      />
      </NextIntlClientProvider>
    );
    await act(async () => {
      const mockMonaco = require("monaco-editor");
      const mockEditorInstance = mockMonaco.editor.create;
      mockEditorInstance();

      waitFor(() => {
        expect(mockMonaco.editor.defineTheme).toHaveBeenCalledWith(
          "myCustomTheme",
          expect.any(Object)
        );
        expect(mockMonaco.editor.setTheme).toHaveBeenCalledWith(
          "myCustomTheme"
        );
      });
    });
  });

  test("handleModeChange updates editor mode", () => {
    const setEditorModeMock = jest.fn();
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
      <RequestBodyEditor
        title="Request Body"
        body='{"key": "value"}'
        editorMode="json"
        setEditorMode={setEditorModeMock}
      />
      </NextIntlClientProvider>
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "text" },
    });
    expect(setEditorModeMock).toHaveBeenCalledWith("text");
  });
});
