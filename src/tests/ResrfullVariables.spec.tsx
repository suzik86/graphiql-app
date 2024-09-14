import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import VariableEditor from "../components/RestClient/VariablesEditor";
import { NextIntlClientProvider } from "next-intl";

const messages = {
  Rest: {
    response: "Response",
    status: "Status",
    Body: "Body",
    send: "Send Request",
  },
};

describe("VariableEditor Component", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  const mockVariables = [
    { key: "name", value: "John", included: true },
    { key: "age", value: "30", included: true },
  ];
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSetVariables = jest.fn();
  const mockOnUpdateBody = jest.fn();

  test("renders variables correctly", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <VariableEditor
          variables={mockVariables}
          setVariables={mockSetVariables}
          body="Some body content"
          onUpdateBody={mockOnUpdateBody}
        />
      </NextIntlClientProvider>,
    );

    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("30")).toBeInTheDocument();
  });

  test("adds a new variable and updates body", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <VariableEditor
          variables={mockVariables}
          setVariables={mockSetVariables}
          body="Some body content"
          onUpdateBody={mockOnUpdateBody}
        />
      </NextIntlClientProvider>,
    );

    const newVariableKeyInput = screen.getByPlaceholderText("Rest.key");
    const newVariableValueInput = screen.getByPlaceholderText("Rest.value");
    const addButton = screen.getByText("Rest.add Rest.variable");

    fireEvent.change(newVariableKeyInput, { target: { value: "location" } });
    fireEvent.change(newVariableValueInput, { target: { value: "NY" } });
    fireEvent.click(addButton);

    expect(mockSetVariables).toHaveBeenCalledWith([
      ...mockVariables,
      { key: "location", value: "NY", included: true },
    ]);
    expect(mockOnUpdateBody).toHaveBeenCalled();
  });

  test("deletes a variable", () => {
    act(() => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <VariableEditor
            variables={mockVariables}
            setVariables={mockSetVariables}
            body="{}"
            onUpdateBody={mockOnUpdateBody}
          />
        </NextIntlClientProvider>,
      );
    });

    const deleteButton = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteButton);

    expect(mockSetVariables).toHaveBeenCalledWith([mockVariables[1]]);
  });

  test("handles JSON body update correctly", () => {
    act(() => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <VariableEditor
            variables={mockVariables}
            setVariables={mockSetVariables}
            body="{}"
            onUpdateBody={mockOnUpdateBody}
          />
        </NextIntlClientProvider>,
      );
    });
    // Simulate input changes for new variable key and value
    fireEvent.change(screen.getByPlaceholderText(/Rest.key/i), {
      target: { value: "newVariableKey" },
    });

    fireEvent.change(screen.getByPlaceholderText(/Rest.value/i), {
      target: { value: "newVariableValue" },
    });

    // Simulate clicking the "Add Variable" button
    fireEvent.click(screen.getByText("Rest.add Rest.variable"));
    expect(mockSetVariables).toHaveBeenCalledTimes(1);
    expect(mockOnUpdateBody).toHaveBeenCalledTimes(1);
    expect(mockOnUpdateBody).toHaveBeenCalledWith(
      JSON.stringify(
        {
          name: "{{name}}",
          age: "{{age}}",
          newVariableKey: "{{newVariableKey}}",
        },
        null,
        2,
      ),
    );
  });
});
