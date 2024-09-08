import React, { useState, forwardRef, useImperativeHandle } from "react";
import styles from "./RequestHandler.module.scss";
import RequestBodyEditor from "./RequestBodyEditor";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
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

const RequestHandler = forwardRef<
  {
    sendRequest: () => void;
  },
  RequestHandlerProps
>(
  (
    {
      schema,
      method,
      endpoint,
      variables
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
      try {
        const client = new ApolloClient({
          cache: new InMemoryCache(),
          link: new HttpLink({
            uri: endpoint,
          }),
        });

        const CustomQuery = graphql(String(schema));
        const operationType = method;

        const parsedVariables = variables.reduce(
          (acc, { key, value, included }) => {
            if (included) {
              acc[key] = value;
            }
            return acc;
          },
          {} as { [key: string]: string }
        );

        let response;

        if (operationType === "query") {
          console.log("QUERU", CustomQuery)
          response = await client.query({
            query: CustomQuery,
            variables: parsedVariables,
            context: {
              fetchOptions: {
                next: { revalidate: 10 },
              },
            },
          });

          setStatus(response.errors ? 400 : 200);
        } else if (operationType === "mutation") {
          response = await client.mutate({
            mutation: CustomQuery,
            variables: parsedVariables,
            context: {
              fetchOptions: {
                next: { revalidate: 10 },
              },
            },
          });

          setStatus(response.errors ? 400 : 200);
        }

        setResponse(JSON.stringify(response));
      } catch (error: any) {
        console.error("Request error:", error);
        setStatus(500);
        setResponse(error.message);
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

