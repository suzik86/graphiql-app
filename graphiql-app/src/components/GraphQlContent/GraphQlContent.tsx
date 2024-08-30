"use client";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { graphql } from "gql.tada";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BodyCodePlayground from "../BodyCodePlayGround/BodyCodePlayground";
import GraphiQlUrlEditor from "../GraphiQlUrlEditor/GraphiQlUrlEditor";
import HeadersPlayground from "../HeadersPlayground/HeadersPlayground";
import ResponseCodePlayground from "../ResponseCodePlayGround/ResponseCodePlayGround";
import styles from "./GraphQlContent.module.scss";
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql";
interface Row {
  key: string;
  value: string;
}

const GrafQlContent = () => {
  const pathname = usePathname();
  const searchParam = useSearchParams();

  //const t = useTranslations("HomePage");
  const localActive = useLocale();

  const [requestData, setRequestData] = useState({
    url: "",
    schema: "query {}",
    variables: "{}",
    headers: "{}",
  });

  const [rows, setRows] = useState<Row[]>([{ key: "", value: "" }]);

  const router = useRouter();
  const [data, setData] = useState<string | null>("");
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const encodeBase64 = (input: string) => {
    return Buffer.from(input).toString("base64");
  };

  const decodeBase64 = (input: string) => {
    return Buffer.from(input, "base64").toString("utf-8");
  };

  useEffect(() => {
    const segments = pathname.split("/");
    const bodyBase64String = segments.pop();
    const endpointBase64String = segments.pop();

    if (endpointBase64String && bodyBase64String) {
      try {
        const decodedUrl = decodeBase64(endpointBase64String);
        const decodedBody = decodeBase64(bodyBase64String);

        const bodyJson = JSON.parse(decodedBody);
        setRequestData((prevState) => ({
          ...prevState,
          url: decodedUrl,
          schema: bodyJson.query || "query {}",
          variables: JSON.stringify(bodyJson.variables || {}, null, 2),
        }));

        const params = new URLSearchParams(searchParam.toString());

        const result: Row[] = [];
        for (const [key, value] of params.entries()) {
          if (key) {
            result.push({ key, value });
          }
        }
        result.push({ key: "", value: "" });
        setRows(result);

        const headersObject: Record<string, string> = result.reduce(
          (acc, { key, value }) => {
            if (key) {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, string>,
        );

        const handleReceive = async () => {
          const client = new ApolloClient({
            cache: new InMemoryCache(),
            link: new HttpLink({
              uri: decodedUrl,
              headers: headersObject,
            }),
          });

          const CustomQuery = graphql(bodyJson.query);
          const operationType = bodyJson.query.includes("query")
            ? "query"
            : "mutation";
          try {
            const parsedVariables = JSON.parse(
              JSON.stringify(bodyJson.variables || {}, null, 2),
            );

            let response;
            if (operationType === "query") {
              response = await client.query({
                query: CustomQuery,
                variables: parsedVariables,
                context: {
                  fetchOptions: {
                    next: { revalidate: 10 },
                  },
                },
              });
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
            }

            setData(response!.data);
            setStatusCode(200);
          } catch (error: any) {
            console.error("Ошибка запроса:", error);
            setStatusCode(error.networkError?.statusCode || 500);
          }
        };
        handleReceive();
      } catch (error) {
        console.error("Ошибка при декодировании или парсинге:", error);
      }
    }
  }, [pathname, searchParam]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { url, schema, variables, headers } = requestData;
    const encodedUrl = encodeBase64(url);

    const requestBody = JSON.stringify({
      query: schema,
      variables: JSON.parse(variables),
    });
    const encodedBody = encodeBase64(requestBody);

    const parsedHeaders = JSON.parse(headers);
    const queryParams = new URLSearchParams(parsedHeaders).toString();

    const graphqlUrl = `/${localActive}/GRAPHQL/${encodedUrl}/${encodedBody}?${queryParams}`;
    router.push(graphqlUrl);
  };

  const handleChangeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestData((prevState) => ({
      ...prevState,
      url: event.target.value,
    }));
  };

  const handleChangeHeaders = (headers: Row[]) => {
    setRows(headers);
    const obj: { [key: string]: string } = {};
    Object.values(headers).forEach((item) => {
      if (item.key) {
        obj[item.key] = item.value;
      }
    });
    setRequestData((prevState) => ({
      ...prevState,
      headers: JSON.stringify(obj),
    }));
  };

  const handleChangeSchema = (value: string) => {
    setRequestData((prevState) => ({
      ...prevState,
      schema: value,
    }));
  };

  const handleChangeVariables = (value: string) => {
    setRequestData((prevState) => ({
      ...prevState,
      variables: value,
    }));
  };

  const fetchSchema = async (url: string) => {
    const response  = await fetch(url, {
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
    console.log("schema", schema)
    return schema
  }
  return (
    <section className={styles.content}>
      <div className={styles.content__inner}>
        <form className={styles.content__form} onSubmit={handleSubmit}>
          <h1 className={styles.content__title}>GraphiQl Client</h1>
          <GraphiQlUrlEditor
            handleChangeUrl={handleChangeUrl}
            url={requestData.url}
          />
          <div className={styles.content__background} />
          <div className={styles.content__field}>
            <p className={styles.content__field__title}></p>
          </div>
          <HeadersPlayground
            title={"Headers"}
            handleChangeHeaders={handleChangeHeaders}
            rows={rows}
          />
          <BodyCodePlayground
            title={"Query"}
            handleChangeField={handleChangeSchema}
            code={requestData.schema}
          />
          <BodyCodePlayground
            title={"Variables"}
            handleChangeField={handleChangeVariables}
            code={requestData.variables}
          />
        </form>

        <div className={styles.response}>
          <p className={styles.response__title}>Response</p>
          <div className={styles.response__status}>
            <p className={styles.response__status__text}>Status:</p>
            <div className={styles.response__status__code}>
              {statusCode !== null ? statusCode : "N/A"}
            </div>
          </div>
          <ResponseCodePlayground
            title={"Body"}
            response={JSON.stringify(data)}
          />
        </div>
      </div>
      <button onClick={()=>fetchSchema("https://swapi-graphql.netlify.app/.netlify/functions/index?sdl")}>fetch</button>
    </section>
  );
};

export default GrafQlContent;

/*
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { graphql } from "gql.tada";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BodyCodePlayground from "../BodyCodePlayGround/BodyCodePlayground";
import GraphiQlUrlEditor from "../GraphiQlUrlEditor/GraphiQlUrlEditor";
import HeadersPlayground from "../HeadersPlayground/HeadersPlayground";
import ResponseCodePlayground from "../ResponseCodePlayGround/ResponseCodePlayGround";
import styles from "./GraphQlContent.module.scss";

interface Row {
  key: string;
  value: string;
}

const GrafQlContent = () => {
  const pathname = usePathname();
  const searchParam = useSearchParams();
  const localActive = useLocale();

  const [requestData, setRequestData] = useState({
    url: "",
    schema: "query {}",
    variables: "{}",
    headers: "{}",
  });

  const [rows, setRows] = useState<Row[]>([{ key: "", value: "" }]);
  const [data, setData] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [schema, setSchema] = useState<string | null>(null);

  const router = useRouter();

  const encodeBase64 = (input: string) => Buffer.from(input).toString("base64");
  const decodeBase64 = (input: string) => Buffer.from(input, "base64").toString("utf-8");

  useEffect(() => {
    const segments = pathname.split("/");
    const bodyBase64String = segments.pop();
    const endpointBase64String = segments.pop();

    if (endpointBase64String && bodyBase64String) {
      try {
        const decodedUrl = decodeBase64(endpointBase64String);
        const decodedBody = decodeBase64(bodyBase64String);

        const bodyJson = JSON.parse(decodedBody);
        setRequestData((prevState) => ({
          ...prevState,
          url: decodedUrl,
          schema: bodyJson.query || "query {}",
          variables: JSON.stringify(bodyJson.variables || {}, null, 2),
        }));

        const params = new URLSearchParams(searchParam.toString());
        const result: Row[] = [];

        for (const [key, value] of params.entries()) {
          if (key) result.push({ key, value });
        }

        result.push({ key: "", value: "" });
        setRows(result);

        const headersObject: Record<string, string> = result.reduce(
          (acc, { key, value }) => {
            if (key) acc[key] = value;
            return acc;
          },
          {} as Record<string, string>
        );

        const handleReceive = async () => {
          const client = new ApolloClient({
            cache: new InMemoryCache(),
            link: new HttpLink({
              uri: decodedUrl,
              headers: headersObject,
            }),
          });

          try {
       
            const introspectionResult = await client.query({
              query: graphql(getIntrospectionQuery()),
            });

            const schemaJSON = introspectionResult.data;
            const clientSchema = buildClientSchema(schemaJSON);
            setSchema(printSchema(clientSchema));

        
            const CustomQuery = graphql(bodyJson.query);
            const operationType = bodyJson.query.includes("query") ? "query" : "mutation";

            let response;
            const parsedVariables = JSON.parse(JSON.stringify(bodyJson.variables || {}, null, 2));

            if (operationType === "query") {
              response = await client.query({
                query: CustomQuery,
                variables: parsedVariables,
                context: { fetchOptions: { next: { revalidate: 10 } } },
              });
            } else if (operationType === "mutation") {
              response = await client.mutate({
                mutation: CustomQuery,
                variables: parsedVariables,
                context: { fetchOptions: { next: { revalidate: 10 } } },
              });
            }

            setData(JSON.stringify(response!.data, null, 2));
            setStatusCode(200);
          } catch (error: any) {
            console.error("Ошибка запроса:", error);
            setStatusCode(error.networkError?.statusCode || 500);
          }
        };

        handleReceive();
      } catch (error) {
        console.error("Ошибка при декодировании или парсинге:", error);
      }
    }
  }, [pathname, searchParam]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { url, schema, variables, headers } = requestData;
    const encodedUrl = encodeBase64(url);

    const requestBody = JSON.stringify({
      query: schema,
      variables: JSON.parse(variables),
    });
    const encodedBody = encodeBase64(requestBody);

    const parsedHeaders = JSON.parse(headers);
    const queryParams = new URLSearchParams(parsedHeaders).toString();

    const graphqlUrl = `/${localActive}/GRAPHQL/${encodedUrl}/${encodedBody}?${queryParams}`;
    router.push(graphqlUrl);
  };

  const handleChangeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestData((prevState) => ({
      ...prevState,
      url: event.target.value,
    }));
  };

  const handleChangeHeaders = (headers: Row[]) => {
    setRows(headers);
    const obj: { [key: string]: string } = {};
    headers.forEach((item) => {
      if (item.key) {
        obj[item.key] = item.value;
      }
    });
    setRequestData((prevState) => ({
      ...prevState,
      headers: JSON.stringify(obj),
    }));
  };

  const handleChangeSchema = (value: string) => {
    setRequestData((prevState) => ({
      ...prevState,
      schema: value,
    }));
  };

  const handleChangeVariables = (value: string) => {
    setRequestData((prevState) => ({
      ...prevState,
      variables: value,
    }));
  };

  const fetchSchema = async (url: string) => {
    const response  = await fetch(url, {
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
    console.log("schema", schema)
    return schema
  }

  return (
    <section className={styles.content}>
      <div className={styles.content__inner}>
        <form className={styles.content__form} onSubmit={handleSubmit}>
          <h1 className={styles.content__title}>GraphiQl Client</h1>
          <GraphiQlUrlEditor handleChangeUrl={handleChangeUrl} url={requestData.url} />
          <div className={styles.content__background} />
          <div className={styles.content__field}>
            <p className={styles.content__field__title}></p>
          </div>
          <HeadersPlayground title={"Headers"} handleChangeHeaders={handleChangeHeaders} rows={rows} />
          <BodyCodePlayground title={"Query"} handleChangeField={handleChangeSchema} code={requestData.schema} />
          <BodyCodePlayground title={"Variables"} handleChangeField={handleChangeVariables} code={requestData.variables} />
        </form>
        <div className={styles.response}>
          <p className={styles.response__title}>Response</p>
          <div className={styles.response__status}>
            <p className={styles.response__status__text}>Status:</p>
            <div className={styles.response__status__code}>{statusCode !== null ? statusCode : "N/A"}</div>
          </div>
         
          <div className={styles.response__schema}>
            <h2>Schema</h2>
            <pre>{schema}</pre>
          </div>
        </div>
      </div>
      <button onClick={()=>fetchSchema("https://swapi-graphql.netlify.app/.netlify/functions/index?sdl")}>fetch</button>
    </section>
  );
};

export default GrafQlContent;
 */