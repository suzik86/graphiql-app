import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  handleClientError,
  handleServerError,
} from "../../utils/errorHandlers";
import styles from "./RequestHandler.module.scss";
import { encodeBase64 } from "../../utils/base64";
import RequestBodyEditor from "./RequestBodyEditor";
import { useTranslations } from "next-intl";
interface RequestHandlerProps {
  method: string;
  endpoint: string;
  headers: { key: string; value: string; included: boolean }[];
  body: object | string | null;
  editorMode: "json" | "text";
  variables: { key: string; value: string; included: boolean }[];
}

const RequestHandler = forwardRef<
  {
    sendRequest: () => void;
  },
  RequestHandlerProps
>(
  (
    {
      method,
      endpoint,
      headers,
      body,
      editorMode,
      variables,
    }: RequestHandlerProps,
    ref,
  ) => {
    const [response, setResponse] = useState<string>("");
    const [status, setStatus] = useState<number | null>(null);

    const replacePlaceholders = (
      text: string,
      variables: { key: string; value: string; included: boolean }[],
    ) => {
      let updatedText = text;
      variables.forEach((variable) => {
        if (variable.included) {
          const placeholder = `{{${variable.key}}}`;
          updatedText = updatedText.replace(
            new RegExp(placeholder, "g"),
            variable.value,
          );
        }
      });
      return updatedText;
    };

    const sendRequest = async () => {
      setResponse("");
      try {
        const bodyString =
          body === null
            ? ""
            : typeof body === "string"
              ? body
              : JSON.stringify(body);
        const bodyWithVariables = replacePlaceholders(bodyString, variables);
        const encodedEndpoint = encodeBase64(endpoint);
        const encodedBody = bodyWithVariables
          ? encodeBase64(bodyWithVariables)
          : "";

        const queryParams = headers
          .filter((header) => header.included)
          .map(
            (header) =>
              `${encodeURIComponent(header.key)}=${encodeURIComponent(header.value)}`,
          )
          .join("&");

        const url = `/api/${method}/${encodedEndpoint}${encodedBody ? `/${encodedBody}` : ""}${queryParams ? `?${queryParams}` : ""}`;

        const requestHeaders: Record<string, string> = {
          "Content-Type":
            editorMode === "json" ? "application/json" : "text/plain",
        };

        const response = await fetch(url, {
          method: method,
          headers: requestHeaders,
          body: method === "GET" ? undefined : bodyWithVariables,
        });

        const data = await response.text();

        setStatus(response.status);

        if (response.ok) {
          setResponse(data);
        } else if (response.status >= 400 && response.status < 500) {
          setResponse(handleClientError(response.status));
        } else if (response.status >= 500) {
          setResponse(handleServerError(response.status));
        } else {
          setResponse(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch {
        setStatus(500);
        setResponse(handleServerError(500));
      }
    };

    useImperativeHandle(ref, () => ({
      sendRequest,
    }));

    const getStatusClassName = (status: number | null) => {
      if (status === null) return styles.response__status__default;
      if (status >= 200 && status < 300)
        return styles.response__status__success;
      if (status >= 400 && status < 500)
        return styles.response__status__clientError;
      if (status >= 500) return styles.response__status__serverError;
      return styles.response__status__default;
    };

    const formatJson = (jsonString: string): string => {
      if (!jsonString || jsonString.trim() === "") {
        return "";
      }
      try {
        const json = JSON.parse(jsonString);
        return JSON.stringify(json, null, 2);
      } catch {
        return jsonString;
      }
    };

    const t = useTranslations("Rest");
    return (
      <div className={styles.response}>
        <p className={styles.response__title}>{t("response")}</p>

        <div className={styles.response__status}>
          <p className={styles.response__status__text}>{t("status")}:</p>
          <div
            className={`${styles.response__status__code} ${getStatusClassName(status)}`}
          >
            {status !== null ? status : "N/A"}
          </div>
        </div>

        <RequestBodyEditor
          title={"Body"}
          body={formatJson(response)}
          editorMode="json"
          readOnly={true}
        />
      </div>
    );
  },
);

export default RequestHandler;
