import React, { useState, forwardRef, useImperativeHandle } from "react";
import styles from "./RequestHandler.module.scss";
import RequestBodyEditor from "./RequestBodyEditor";
import { buildClientSchema, getIntrospectionQuery } from "graphql";
import { useTranslations } from "next-intl";

interface RequestHandlerProps {
  schema: string;
  method: string;
  endpoint: string;
  headers: { key: string; value: string; included: boolean }[];
  body: object | string | null;
  editorMode: "json" | "text";
  variables: { key: string; value: string; included: boolean }[];
}

const RequestHandlerSdl = forwardRef<
  {
    sendRequest: (endpoint: string) => void;
  },
  RequestHandlerProps
>(({ endpoint }: RequestHandlerProps, ref) => {
  const [response, setResponse] = useState<string>("");
  const [status, setStatus] = useState<number | null>(null);

  const sendRequest = async () => {
    if (endpoint.includes("sdl")) {
      try {
        console.log("ENDPOINT", endpoint);

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: getIntrospectionQuery(),
          }),
        });

        const results = await response.json();

        if (response.ok) {
          const schema = buildClientSchema(results.data);
          console.log(schema);

          setStatus(200);
          setResponse(JSON.stringify(schema));
        } else {
          setStatus(response.status);
          setResponse(JSON.stringify(results));
        }
      } catch (error: unknown) {
        let errorMessage = "Unknown error occurred";

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        }

        console.error("Request error:", errorMessage);

        setStatus(500);
        setResponse(errorMessage);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    sendRequest,
  }));

  const getStatusClassName = (status: number | null) => {
    if (status === null) return styles.response__status__default;
    if (status >= 200 && status < 300) return styles.response__status__success;
    if (status >= 400 && status < 500)
      return styles.response__status__clientError;
    if (status >= 500) return styles.response__status__serverError;
    return styles.response__status__default;
  };

  const formatJson = (jsonString: string): string => {
    try {
      const json = JSON.parse(jsonString);
      return JSON.stringify(json, null, 2);
    } catch (e) {
      console.error("Invalid JSON:", e);
      return jsonString;
    }
  };

  const t = useTranslations("GraphQl");

  return (
    <>
      {response && (
        <div className={styles.response}>
          <p className={styles.response__title}>{t("Documentation")}</p>

          <div className={styles.response__status}>
            <p className={styles.response__status__text}>{t("status")}:</p>
            <div
              className={`${styles.response__status__code} ${getStatusClassName(status)}`}
            >
              {status !== null ? status : "N/A"}
            </div>
          </div>

          <RequestBodyEditor
            title={t("body")}
            body={formatJson(response)}
            editorMode="json"
            readOnly={true}
          />
        </div>
      )}
    </>
  );
});

export default RequestHandlerSdl;
