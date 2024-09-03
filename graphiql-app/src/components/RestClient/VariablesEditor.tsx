import React, { useState, useCallback } from "react";
import KeyValueEditor from "../KeyValueEditor/KeyValueEditor";

type Variable = {
  key: string;
  value: string;
  included: boolean;
};

type VariableEditorProps = {
  variables: Variable[];
  setVariables: React.Dispatch<React.SetStateAction<Variable[]>>;
  body: string;
  onUpdateBody: (updatedBody: string) => void;
};

const VariableEditor: React.FC<VariableEditorProps> = ({
  variables,
  setVariables,
  body,
  onUpdateBody,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createVariableMap = (variables: Variable[]): Map<string, string> => {
    return new Map(
      variables.filter((v) => v.included).map((v) => [v.key, v.value]),
    );
  };

  const updateJsonBody = (
    jsonBody: Record<string, unknown>,
    variableMap: Map<string, string>,
  ): Record<string, unknown> => {
    const updatedObject: Record<string, unknown> = { ...jsonBody };

    variableMap.forEach((_value, newKey) => {
      updatedObject[newKey] = `{{${newKey}}}`;
    });

    Object.keys(updatedObject).forEach((existingKey) => {
      if (
        updatedObject[existingKey] === `{{${existingKey}}}` &&
        !variableMap.has(existingKey)
      ) {
        console.log(`Removing unused key: ${existingKey}`);
        delete updatedObject[existingKey];
      }
    });

    return updatedObject;
  };

  const updateTextBody = (
    body: string,
    variableMap: Map<string, string>,
  ): string => {
    let newBody = body;
    const placeholders = Array.from(variableMap.keys()).map(
      (key) => `{{${key}}}`,
    );

    const placeholderRegex = /{{\s*[^{}]+\s*}}/g;

    newBody = newBody.replace(placeholderRegex, (match) => {
      return placeholders.includes(match) ? match : "";
    });

    placeholders.forEach((placeholder) => {
      if (!newBody.includes(placeholder)) {
        newBody = `${placeholder} ${newBody}`;
      }
    });

    return newBody.trim();
  };

  const handleParseError = (error: Error) => {
    console.error("Failed to parse body as JSON:", error);
    setErrorMessage("Invalid JSON format. Please check the body content.");
  };

  const updateBody = useCallback(
    (updatedVariables: Variable[]) => {
      console.log("Updating body with variables...");
      console.log("Current body:", body);
      console.log("Variables:", updatedVariables);

      const variableMap = createVariableMap(updatedVariables);

      try {
        const jsonBody = JSON.parse(body);
        console.log("Parsed JSON body:", jsonBody);

        const updatedJsonBody = updateJsonBody(jsonBody, variableMap);
        console.log("Final updated JSON body:", updatedJsonBody);
        onUpdateBody(JSON.stringify(updatedJsonBody, null, 2));
        setErrorMessage(null);
      } catch (error) {
        handleParseError(error as Error);

        const updatedTextBody = updateTextBody(body, variableMap);
        onUpdateBody(updatedTextBody);
      }
    },
    [body, onUpdateBody],
  );

  return (
    <div>
      <KeyValueEditor
        items={variables}
        setItems={setVariables}
        itemType="variable"
        onUpdateURL={updateBody}
      />
      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>
      )}
    </div>
  );
};

export default VariableEditor;
