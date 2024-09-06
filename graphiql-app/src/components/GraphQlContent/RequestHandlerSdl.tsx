import React, { useState, forwardRef, useImperativeHandle } from "react";
import styles from "./RequestHandler.module.scss";
import { encodeBase64 } from "../../utils/base64";
import RequestBodyEditor from "./RequestBodyEditor";




import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { graphql } from "gql.tada";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
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
      schema,
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
if(endpoint.includes("sdl")) {

  console.log(method)
  console.log(111)

      console.log("ENDPOINT", endpoint)

      const response = await fetch(endpoint, {
        method: 'Post',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          query: getIntrospectionQuery(),
        }),
      });


      const results = await response.json()
      const schema = buildClientSchema(results.data)

      console.log(schema)
      setResponse(JSON.stringify(schema))
    }
      //    setSdl(JSON.stringify(schema))
      // return schema

    };
    useImperativeHandle(ref, () => ({
      sendRequest,
    }));

    /*
*/
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
    if (!response  ) {
      return (
        <></>
      )
    }
    return (
      <div className={styles.response}>
        <p className={styles.response__title}>Documentation (Sdl) </p>

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
