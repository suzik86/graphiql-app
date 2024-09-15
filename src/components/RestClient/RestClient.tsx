"use client";
import { useParams, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { decodeBase64 } from "../../utils/base64";
import { updateURL } from "../../utils/urlUpdater";
import HeaderEditor from "./HeaderEditor";
import RequestBodyEditor from "./RequestBodyEditor";
import RequestHandler from "./RequestHandler";
import styles from "./RestClient.module.scss";
import UrlEditor from "./UrlEditor";
import VariableEditor from "./VariablesEditor";
import { useTranslations } from "next-intl";

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
  } catch {
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
    } catch {
      endpoint = decodedString;
    }
  } else if (encodedUrlArray.length === 2) {
    const [encodedEndpoint, encodedData] = encodedUrlArray;
    endpoint = decodeBase64(encodedEndpoint);
    const extractedData = extractBodyAndVariables(encodedData);
    body = extractedData.body;
    initialVariables = extractedData.variables;
  }

  const t = useTranslations("Rest");
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
  const requestHandlerRef =
    React.useRef<React.ElementRef<typeof RequestHandler>>(null);

  useEffect(() => {
    updateURL(currentMethod, currentEndpoint, currentBody, headers, variables);
  }, [currentMethod, currentEndpoint, headers, variables, currentBody]);

  useEffect(() => {
    updateURL(currentMethod, currentEndpoint, blurredBody, headers, variables);
  }, [blurredBody, currentMethod, currentEndpoint, headers, variables]);

  const handleBodyUpdate = (updatedBody: string) => {
    setBody(updatedBody);
  };

  const savePathname = useCallback(() => {
    const pathnames = JSON.parse(localStorage.getItem("pathnames") || "[]");
    const newPath = {
      path: window.location.href,
      date: new Date().toISOString(),
      endpoint: currentEndpoint,
    };
    pathnames.push(newPath);
    localStorage.setItem("pathnames", JSON.stringify(pathnames));
  }, [currentEndpoint]);

  const sendRequest = useCallback(() => {
    savePathname();
    requestHandlerRef.current?.sendRequest();
  }, [savePathname, requestHandlerRef]);

  return (
    <section className={styles.content}>
      <div className={styles.content__inner}>
        <div className={styles.content__wrapper}>
          <h1 className={styles.content__title}>{t("title")}</h1>
          <div className={styles.content__background} />

          <UrlEditor
            currentMethod={currentMethod}
            setMethod={setMethod}
            currentEndpoint={currentEndpoint}
            setEndpoint={setEndpoint}
            onSendRequest={sendRequest}
          />
          <HeaderEditor
            title={"Headers"}
            method={currentMethod}
            endpoint={currentEndpoint}
            body={currentBody}
            headers={headers}
            setHeaders={setHeaders}
            variables={variables}
          />
          <div
            className={styles.content__toggle}
            onClick={() => setIsVariablesVisible(!isVariablesVisible)}
          >
            {t("variables")} {isVariablesVisible ? "-" : "+"}
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
            title={"Body"}
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
            ref={requestHandlerRef}
          />
        </div>
      </div>
    </section>
  );
};

export default RestClient;
