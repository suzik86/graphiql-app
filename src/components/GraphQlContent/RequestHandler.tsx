import {
  ApolloClient,
  ApolloError,
  ServerError,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  ApolloLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { graphql } from "gql.tada";
import { useTranslations } from "next-intl";
import { forwardRef, useImperativeHandle, useState } from "react";
import RequestBodyEditor from "./RequestBodyEditor";
import styles from "./RequestHandler.module.scss";

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
      const parsedHeaders = headers.reduce(
        (acc, { key, value, included }) => {
          if (included) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      const errorLink = onError((info) => {
        const { graphQLErrors, networkError } = info;
        if (graphQLErrors)
          graphQLErrors.forEach(({ message }) => setResponse(message));
        if (networkError) {
          if ("statusCode" in networkError) {
            setStatus((networkError as ServerError).statusCode);
          }
        }
      });

      const responseLink = new ApolloLink((operation, forward) => {
        return forward(operation).map((response) => {
          const context = operation.getContext();
          const {
            response: { status },
          } = context;
          if (status) {
            setStatus(status);
          }
          return response;
        });
      });

      const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
        cache: new InMemoryCache(),
        link: from([
          errorLink,
          responseLink,
          new HttpLink({
            uri: endpoint,
            headers: parsedHeaders,
          }),
        ]),
      });
      try {
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
        if (operationType.includes("query")) {
          responseData = await client.query({
            query: CustomQuery,
            variables: parsedVariables,
            context: {
              fetchOptions: {
                next: { revalidate: 10 },
              },
            },
          });
        } else if (operationType.includes("mutation")) {
          responseData = await client.mutate({
            mutation: CustomQuery,
            variables: parsedVariables,
            context: {
              fetchOptions: {
                next: { revalidate: 10 },
              },
            },
          });
        }
        setResponse(JSON.stringify(responseData?.data));
      } catch (error) {
        if (!(error instanceof ApolloError) && error instanceof Error) {
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
      } catch {
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
