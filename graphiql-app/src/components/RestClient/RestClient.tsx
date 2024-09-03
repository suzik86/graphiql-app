"use client";

import React, { useState, useEffect } from "react";
import styles from "./RestClient.module.scss";
import HeaderEditor from "./HeaderEditor";
import { decodeBase64 } from "../../utils/base64";
import { useParams, useSearchParams } from "next/navigation";
import { updateURL } from "../../utils/urlUpdater";
import RequestBodyEditor from "./RequestBodyEditor";
import VariableEditor from "./VariablesEditor";
import RequestHandler from "./RequestHandler";

export interface Header {
  key: string;
  value: string;
  included: boolean;
}

export interface Variable {
  key: string;
  value: string;
  included: boolean;
}

interface ExtractedData {
  body: object | null;
  variables: Variable[];
}

const getHeadersFromParams = (searchParams: URLSearchParams): Header[] => {
  return Array.from(searchParams.entries()).reduce<Header[]>(
    (acc, [key, value]) => {
      if (
        key !== "method" &&
        key !== "encodedEndpoint" &&
        key !== "encodedData"
      ) {
        acc.push({ key, value: decodeURIComponent(value), included: true });
      }
      return acc;
    },
    [],
  );
};

function extractBodyAndVariables(
  encodedData: string | undefined,
): ExtractedData {
  if (!encodedData) {
    return { body: null, variables: [] };
  }

  try {
    const decodedString = decodeBase64(encodedData);
    const dataObject = JSON.parse(decodedString);
    const body = dataObject.body || null;
    const variables = dataObject.variables || [];

    return { body, variables };
  } catch (error) {
    console.error("Error decoding or parsing data:", error);
    return { body: null, variables: [] };
  }
}

const RestClient: React.FC = () => {
  const searchParams = useSearchParams();
  const { method, encodedUrl } = useParams<{
    method: string;
    encodedUrl: string[];
  }>();

  const encodedUrlArray = Array.isArray(encodedUrl) ? encodedUrl : [];
  let endpoint = "";
  let body: object | null = null;
  let initialVariables: Variable[] = [];

  if (encodedUrlArray.length === 1) {
    const singleEncoded = encodedUrlArray[0];
    const decodedString = decodeBase64(singleEncoded);

    try {
      const parsedData = JSON.parse(decodedString);

      if (
        parsedData &&
        typeof parsedData === "object" &&
        !Array.isArray(parsedData)
      ) {
        body = parsedData.body || null;
        initialVariables = parsedData.variables || [];
      } else {
        endpoint = decodedString;
      }
    } catch (error) {
      console.error("Error parsing single encoded parameter:", error);
      endpoint = decodedString;
    }
  } else if (encodedUrlArray.length === 2) {
    const [encodedEndpoint, encodedData] = encodedUrlArray;
    endpoint = decodeBase64(encodedEndpoint);
    const extractedData = extractBodyAndVariables(encodedData);
    body = extractedData.body;
    initialVariables = extractedData.variables;
  }

  const [currentMethod, setMethod] = useState<string>(method || "GET");
  const [currentEndpoint, setEndpoint] = useState<string>(endpoint || "");
  const [headers, setHeaders] = useState<Header[]>(
    getHeadersFromParams(searchParams),
  );
  const [currentBody, setBody] = useState<object | string | null>(body);
  const [blurredBody, setBlurredBody] = useState<object | string | null>(body);
  const [isVariablesVisible, setIsVariablesVisible] = useState<boolean>(true);
  const [variables, setVariables] = useState<Variable[]>(
    initialVariables || [],
  );
  const [editorMode, setEditorMode] = useState<"json" | "text">("json");

  useEffect(() => {
    updateURL(currentMethod, currentEndpoint, currentBody, headers, variables);
  }, [currentMethod, currentEndpoint, headers, variables, currentBody]);

  useEffect(() => {
    updateURL(currentMethod, currentEndpoint, blurredBody, headers, variables);
  }, [blurredBody]);

  const handleBodyUpdate = (updatedBody: string) => {
    setBody(updatedBody);
  };

  return (
    <div className={styles.restClient}>
      <div className={styles.restClient__controls}>
        <select
          value={currentMethod}
          onChange={(e) => {
            setMethod(e.target.value);
          }}
          className={styles.restClient__select}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          type="text"
          value={currentEndpoint}
          onChange={(e) => {
            setEndpoint(e.target.value);
          }}
          placeholder="https://api.example.com/resource"
          className={styles.restClient__input}
        />
      </div>

      <HeaderEditor
        method={currentMethod}
        endpoint={currentEndpoint}
        body={currentBody}
        headers={headers}
        setHeaders={setHeaders}
        variables={variables}
      />

      <div
        className={styles.restClient__variablesToggle}
        onClick={() => setIsVariablesVisible(!isVariablesVisible)}
      >
        Variables Editor {isVariablesVisible ? "-" : "+"}
      </div>

      {isVariablesVisible && (
        <VariableEditor
          variables={variables}
          setVariables={setVariables}
          body={blurredBody as string}
          onUpdateBody={handleBodyUpdate}
        />
      )}

      <RequestBodyEditor
        body={currentBody}
        setBlurredBody={setBlurredBody}
        variables={variables}
        editorMode={editorMode}
        setEditorMode={setEditorMode}
      />

      <RequestHandler
        method={currentMethod}
        endpoint={currentEndpoint}
        headers={headers}
        body={blurredBody}
        editorMode={editorMode}
        variables={variables}
      />
    </div>
  );
};

export default RestClient;
