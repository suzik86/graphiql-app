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
import SdlEditor from "./SdlEditor"
import RequestHandlerSdl from "./RequestHandlerSdl"






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
 /* const [headers, setHeaders] = useState<Header[]>(
    getHeadersFromParams(searchParams),
  ); */
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



  const handleChangeSchema = (query: string) => {
    setSchema(query)
  }

  const sendRequest = () => {
    requestHandlerRef.current?.sendRequest();
  };
  const requestHandlerSdlRef = useRef<React.ElementRef<typeof RequestHandlerSdl>>(null);
  const [sdlEndpoint, setSdlEndpoint] = useState("")
  const handleChangeSdlEndpoint = (value: string) => {
   setSdlEndpoint(value)
  }
  const sendRequestSdl = (endpoint: string) => {

    console.log(endpoint)
  requestHandlerSdlRef.current?.sendRequest(endpoint);
  };
  return (

    <section className={styles.content}>
      <div className={styles.content__inner}>
        <div className={styles.content__wrapper}>
          <h1 className={styles.content__title}>GraphQl Client</h1>
          <div className={styles.content__background} />
          <div className={styles.content__inputs}>

            <UrlEditor
              currentMethod={currentMethod}
              setMethod={setMethod}

              currentEndpoint={currentEndpoint}
              setEndpoint={setEndpoint}
              onSendRequest={sendRequest}
            />

            <SdlEditor
              currentMethod={currentMethod}
              setMethod={setMethod}

              currentEndpoint={sdlEndpoint}
              setEndpoint={setSdlEndpoint}
            //  setEndpoint={handleChangeSdlEndpoint}
        //      setEndpoint={setEndpoint}
              onSendRequest={sendRequestSdl}

            />
          </div>

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
            schema={String(schema)}
            method={currentMethod}
            endpoint={currentEndpoint}
            headers={headers}
            body={blurredBody}
            editorMode={editorMode}
            variables={variables}
            ref={requestHandlerRef}
          />

          <RequestHandlerSdl
            schema={String(schema)}
            method={currentMethod}
        //    endpoint={currentEndpoint}
        endpoint={sdlEndpoint}
            headers={headers}
            body={blurredBody}
            editorMode={editorMode}
            variables={variables}
            ref={requestHandlerSdlRef}

          />

        </div>
      </div>
    </section>
  );
}

export default GrafQlContent; 