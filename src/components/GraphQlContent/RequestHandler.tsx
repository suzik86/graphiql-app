import React, { useState, forwardRef, useImperativeHandle } from "react";
import styles from "./RequestHandler.module.scss";
import RequestBodyEditor from "./RequestBodyEditor";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { graphql } from "gql.tada";
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

interface ParsedVariables {
  [key: string]: string;
}

interface RequestHandlerRef {
  sendRequest: () => void;
}

const RequestHandler = forwardRef<RequestHandlerRef, RequestHandlerProps>(
  (
    { schema, method, endpoint, headers, variables }: RequestHandlerProps,
    ref,
  ) => {
    const [response, setResponse] = useState<string>("");
    const [status, setStatus] = useState<number | null>(null);

    const sendRequest = async () => {
      try {
        const parsedHeaders = headers.reduce(
          (acc, { key, value, included }) => {
            if (included) {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, string>,
        );

        const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
          cache: new InMemoryCache(),
          link: new HttpLink({
            uri: endpoint,
            headers: parsedHeaders,
          }),
        });

        const CustomQuery = graphql(String(schema));
        const operationType = method.trim();

        const parsedVariables: ParsedVariables = variables.reduce(
          (acc, { key, value, included }) => {
            if (included) {
              acc[key] = value;
            }
            return acc;
          },
          {} as ParsedVariables,
        );

        let responseData;

        if (operationType === "query") {
          responseData = await client.query({
            query: CustomQuery,
            variables: parsedVariables,
            context: {
              fetchOptions: {
                next: { revalidate: 10 },
              },
            },
          });

          setStatus(responseData.errors ? 400 : 200);
        } else if (operationType === "mutation") {
          responseData = await client.mutate({
            mutation: CustomQuery,
            variables: parsedVariables,
            context: {
              fetchOptions: {
                next: { revalidate: 10 },
              },
            },
          });

          setStatus(responseData.errors ? 400 : 200);
        }

        setResponse(JSON.stringify(responseData));
      } catch (error) {
        if (error instanceof Error) {
          console.error("Request error:", error);
          setStatus(500);
          setResponse(error.message);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      sendRequest,
    }));

    const getStatusClassName = (status: number | null): string => {
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
    const t = useTranslations("GraphQl");
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
          title={t("body")}
          body={formatJson(response)}
          editorMode="json"
          readOnly={true}
        />
      </div>
    );
  },
);

export default RequestHandler;
