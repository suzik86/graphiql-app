/*import React, { useState, useCallback } from "react";
import KeyValueEditor from "./KeyValueEditor";

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

  // Функция для создания карты переменных
  const createVariableMap = (variables: Variable[]): Map<string, string> => {
    return new Map(
      variables.filter((v) => v.included).map((v) => [v.key, v.value]),
    );
  };

  // Обновляем JSON объект переменными
  const updateJsonBody = (
    jsonBody: Record<string, unknown>,
    variableMap: Map<string, string>,
  ): Record<string, unknown> => {
    const updatedObject: Record<string, unknown> = { ...jsonBody };

    // Добавляем или обновляем значения
    variableMap.forEach((value, key) => {
      updatedObject[key] = value;
    });

    return updatedObject;
  };

  // Обновляем текстовое тело без метода replace
  const updateTextBody = (
    body: string,
    variableMap: Map<string, string>,
  ): string => {
    // Разбиваем тело на массив слов для обновления
    console.log("body", body)
    const bodyParts = body.split(/\s+/);

    // Создаем массив для обновленного тела
    const updatedParts = bodyParts.map((part) => {
      // Проверяем, является ли текущая часть шаблоном {{key}}
      if (part.startsWith("{{") && part.endsWith("}}")) {
        const key = part.slice(2, -2).trim(); // Извлекаем ключ между {{ и }}
        if (variableMap.has(key)) {
          return variableMap.get(key) || ""; // Заменяем шаблон значением
        }
      }
      return part; // Если это не шаблон, оставляем часть как есть
    });

    return updatedParts.join(" "); // Собираем обновленный текст обратно
  };

  // Функция обработки ошибок
  const handleParseError = () => {
    setErrorMessage("Invalid JSON format. Please check the body content.");
  };

  // Основная функция обновления тела
  const updateBody = useCallback(
    (updatedVariables: Variable[]) => {
      const variableMap = createVariableMap(updatedVariables);

      try {
        // Пробуем разобрать тело как JSON
        const jsonBody = JSON.parse(body);
        const updatedJsonBody = updateJsonBody(jsonBody, variableMap);
        onUpdateBody(JSON.stringify(updatedJsonBody, null, 2));
        setErrorMessage(null);
      } catch {
        // Если JSON невалиден, обновляем как текст
        const updatedTextBody = updateTextBody(body, variableMap);
        onUpdateBody(updatedTextBody);
        setErrorMessage("Invalid JSON format. Updated text body instead.");
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
*/

import React, { useState, useCallback } from "react";
import KeyValueEditor from "./KeyValueEditor";

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
        delete updatedObject[existingKey];
      }
    });

    return updatedObject;
  };

  const updateBody = useCallback(
    (updatedVariables: Variable[]) => {
      const variableMap = createVariableMap(updatedVariables);

      let jsonBody;
      if (jsonBody) {
        jsonBody = JSON.parse(body);
        const updatedJsonBody = updateJsonBody(jsonBody, variableMap);
        onUpdateBody(JSON.stringify(updatedJsonBody, null, 2));
        setErrorMessage(null);
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
