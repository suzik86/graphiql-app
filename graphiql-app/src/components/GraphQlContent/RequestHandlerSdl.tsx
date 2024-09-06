import React, { useState, forwardRef, useImperativeHandle } from "react";
import styles from "./RequestHandler.module.scss";
import RequestBodyEditor from "./RequestBodyEditor";
import { buildClientSchema, getIntrospectionQuery } from "graphql";

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
>(
  (
    {
      method,
      endpoint,
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

            setStatus(200); // Successful request
            setResponse(JSON.stringify(schema));
          } else {
            setStatus(response.status); // Server errors
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

          setStatus(500); // Client-side error
          setResponse(errorMessage);
        }
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
      try {
        const json = JSON.parse(jsonString);
        return JSON.stringify(json, null, 2);
      } catch (e) {
        console.error("Invalid JSON:", e);
        return jsonString;
      }
    };

    if (!response) {
      return <></>;
    }

    return (
      <div className={styles.response}>
        <p className={styles.response__title}>Documentation (SDL)</p>

        <div className={styles.response__status}>
          <p className={styles.response__status__text}>Status:</p>
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

export default RequestHandlerSdl;

/*
import React, { useState, forwardRef, useImperativeHandle } from "react";
import styles from "./RequestHandler.module.scss";
import RequestBodyEditor from "./RequestBodyEditor";
import { buildClientSchema, getIntrospectionQuery } from "graphql";

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
>(
  (
    {
      method,
      endpoint,
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

            setStatus(200); // Успешный запрос
            setResponse(JSON.stringify(schema));
          } else {
            setStatus(response.status); // Ошибки сервера
            setResponse(JSON.stringify(results));
          }
        } catch (error: any) {
          console.error("Ошибка запроса:", error);

          setStatus(500); // Ошибка на клиенте
          setResponse(error.message);
        }
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
      try {
        const json = JSON.parse(jsonString);
        return JSON.stringify(json, null, 2);
      } catch (e) {
        console.error("Invalid JSON:", e);
        return jsonString;
      }
    };

    if (!response) {
      return <></>;
    }

    return (
      <div className={styles.response}>
        <p className={styles.response__title}>Documentation (SDL)</p>

        <div className={styles.response__status}>
          <p className={styles.response__status__text}>Status:</p>
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

export default RequestHandlerSdl;

 */