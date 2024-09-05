"use client"
import UrlEditor from "./UrlEditor"
import { useState, useEffect, useRef } from "react"
import { updateURL } from "../../utils/urlUpdater"
import styles from "./GraphQlContent.module.scss"
import VariableEditor from "./VariablesEditor"
import HeaderEditor from "./HeaderEditor"
import RequestHandler from "./RequestHandler"
import RequestBodyEditor from "./RequestBodyEditor"
import { useParams, useSearchParams } from "next/navigation";






import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { graphql } from "gql.tada";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { buildClientSchema, getIntrospectionQuery } from "graphql";
import QueryEditor from "./QueryEditor"






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

/*
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
}; */
const GrafQlContent = () => {

  const [headers, setHeaders] = useState<Header[]>(
    [{
      key: "",
      value: "",
      included: false
    }]
    // getHeadersFromParams(searchParams),
  );
  const [currentEndpoint, setEndpoint] = useState("")
  const searchParams = useSearchParams();
  const { method, encodedUrl } = useParams<{
    method: string;
    encodedUrl: string[];
  }>();

  const [currentMethod, setMethod] = useState<string>(method || "query");
  let body: object | null = null;
  const [blurredBody, setBlurredBody] = useState<object | string | null>(body);
  const [currentBody, setBody] = useState<object | string | null>(body);
  const [variables, setVariables] = useState<Variable[]>(
    [

    ]
    //  initialVariables || [],
  );
  const [isVariablesVisible, setIsVariablesVisible] = useState<boolean>(true);

  useEffect(() => {
    updateURL("graphql", currentEndpoint, currentBody, headers, variables);
  }, [currentEndpoint, headers, variables, currentBody]);
  /*
    useEffect(() => {
      updateURL("graphql", currentEndpoint, blurredBody, headers, variables);
    }, [blurredBody]);
  */
  const handleBodyUpdate = (updatedBody: string) => {
    setBody(updatedBody);
  };
  const [editorMode, setEditorMode] = useState<"json" | "text">("json");
  const requestHandlerRef = useRef<React.ElementRef<typeof RequestHandler>>(null);

  const [schema, setSchema] = useState<object | string | null>(body);




  const sendRequest = () => {







    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: currentEndpoint,
        //  headers: headersObject,
      }),
    });

    /*
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

  
console.log(11)
*/
  }

  const handleChangeSchema = (query: string) => {
    setSchema(query)
  }
  return (

    <section className={styles.content}>
      <div className={styles.content__inner}>
        <div className={styles.content__wrapper}>
          <h1 className={styles.content__title}>GraphQl Client</h1>
          <div className={styles.content__background} />

          <UrlEditor
            currentMethod={currentMethod}
            setMethod={setMethod}
            //    currentMethod={"graphql"}
            //    setMethod={null}
            //     setMethod={setMethod}
            currentEndpoint={currentEndpoint}
            setEndpoint={setEndpoint}
            onSendRequest={sendRequest}
          />

          <HeaderEditor
            title={"Headers"} // название секции
            //    method={"graphql"} // метод
            method={currentMethod}

            endpoint={currentEndpoint} // url 
            body={currentBody} // тело 
            headers={headers} // заголовки
            setHeaders={setHeaders} // установить заголовки
            variables={variables} // переменные
          />

          <div
            className={styles.content__toggle}
            onClick={() => setIsVariablesVisible(!isVariablesVisible)}
          >
            Variables {isVariablesVisible ? "-" : "+"}
          </div>

          {isVariablesVisible && (
            <VariableEditor
              variables={variables}
              setVariables={setVariables}
              body={blurredBody as string}
              onUpdateBody={handleBodyUpdate}
            />
          )}
          {/*
        <RequestBodyEditor
        title={"Body"}
          body={currentBody}
        
          setBlurredBody={setBlurredBody}
          variables={variables}
          editorMode={editorMode}
          setEditorMode={setEditorMode}
        />
        */}
          {/*
          <RequestBodyEditor
          body={schema}
            title={"Request editor"}
            variables={variables}
            editorMode={"graphql"}
            setEditorMode={setEditorMode}
            />
            */}



          {JSON.stringify(schema)}
          <QueryEditor
            body={schema}
            title={"Request editor"}
            variables={variables}
            editorMode={"graphql"}
            setEditorMode={setEditorMode}
            handleChangeSchema={handleChangeSchema}
          //  onChange={}
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
}

export default GrafQlContent;
/*
 <section className={styles.content}>
      <div className={styles.content__inner}>
        <div className={styles.content__wrapper}>
          <h1 className={styles.content__title}>RESTfull Client</h1>
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
            Variables {isVariablesVisible ? "-" : "+"}
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
    */

/*"use client";
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
import { buildClientSchema, getIntrospectionQuery } from "graphql";
import GraphiQlSdlEditor from "../GraphiQlSdlEditor/GraphiQlSdlEditor";
//import GraphiQlSdlEditor from "../GraphiQlSdlEditor/GraphQlSdlEditor";
import ModalComponent from "../Modal/Modal";
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
    sdl: "",
    schema: "query {}",
    variables: "{}",
    headers: "{}",
  });

  const [rows, setRows] = useState<Row[]>([{ key: "", value: "" }]);

  const router = useRouter();
  const [data, setData] = useState<string | null>("");
  const [statusCode, setStatusCode] = useState<number | null>(null);
const [sdl, setSdl] = useState("")
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
  const handleChangeSdl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestData((prevState) => ({
      ...prevState,
    sdl:event.target.value,
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
 
    setSdl(JSON.stringify(schema))
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
            btn={"Send"}
          />
         

           <GraphiQlSdlEditor 
              handleChangeUrl={handleChangeSdl}
              url={requestData.sdl}
              btn={"Get schema"}
              handleSubmit={fetchSchema}
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
      {sdl}

      <ModalComponent />
    </section>
  );
};

export default GrafQlContent;
*/
/*
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
    </section>
  );
};

export default GrafQlContent;
*/