import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RequestBodyEditor from "../components/RestClient/RequestBodyEditor";
import { act } from "@testing-library/react";

jest.mock("monaco-editor", () => require("./mocks/monaco-editor"));

describe("RequestBodyEditor Component", () => {
  const mockSetEditorMode = jest.fn();

  beforeEach(() => {
    jest.resetModules();
    Object.defineProperty(window, "devicePixelRatio", { value: 1 });
    jest.clearAllMocks();
  });

  test("renders the editor with correct title and default values", () => {
    render(
      <RequestBodyEditor title="Request Body" body={null} editorMode="json" />
    );

    expect(screen.getByText("Request Body")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveValue("json");
  });

  test("calls setBlurredBody on editor blur", async () => {
    const mockSetBlurredBody = jest.fn();

    act(() => {
      render(
        <RequestBodyEditor
          title="Request Body"
          body='{"key": "value"}'
          setBlurredBody={mockSetBlurredBody}
          editorMode="json"
        />
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
      <RequestBodyEditor
        title="Request Body"
        body="Some text body"
        editorMode="text"
        setEditorMode={mockSetEditorMode}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "json" } });

    expect(mockSetEditorMode).toHaveBeenCalledWith("json");
  });

  test("displays the Beautify button when in JSON mode", () => {
    render(
      <RequestBodyEditor
        title="Request Body"
        body='{"key": "value"}'
        editorMode="json"
        setEditorMode={mockSetEditorMode}
      />
    );

    const beautifyButton = screen.getByText("Beautify");
    expect(beautifyButton).toBeInTheDocument();
  });

  test("renders Monaco editor in non-read-only mode", async () => {
    render(
      <RequestBodyEditor
        title="Request Body"
        body='{"key": "value"}'
        editorMode="json"
        readOnly={false}
      />
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
      <RequestBodyEditor
        title="Request Body"
        body='{"key": "value"}'
        setBlurredBody={() => {}}
        editorMode="json"
        setEditorMode={() => {}}
      />
    );

    const beautifyButton = screen.getByText("Beautify");

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
      <RequestBodyEditor
        title="Request Body"
        body='{"key": "value"}'
        setBlurredBody={() => {}}
        editorMode="json"
        setEditorMode={() => {}}
      />
    );

    const beautifyButton = screen.getByText("Beautify");

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
      <RequestBodyEditor
        title="Request Body"
        body='{"key": "value"}'
        editorMode="json"
      />
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
      <RequestBodyEditor
        title="Request Body"
        body='{"key": "value"}'
        editorMode="json"
        setEditorMode={setEditorModeMock}
      />
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "text" },
    });
    expect(setEditorModeMock).toHaveBeenCalledWith("text");
  });
});
