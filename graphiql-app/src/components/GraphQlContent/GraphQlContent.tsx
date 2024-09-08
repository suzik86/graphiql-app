"use client";
import UrlEditor from "./UrlEditor";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { updateURL } from "../../utils/urlUpdater";
import styles from "./GraphQlContent.module.scss";
import VariableEditor from "./VariablesEditor";
import HeaderEditor from "./HeaderEditor";
import RequestHandler from "./RequestHandler";
import { useSearchParams, usePathname } from "next/navigation";
import QueryEditor from "./QueryEditor";
import SdlEditor from "./SdlEditor";
import RequestHandlerSdl from "./RequestHandlerSdl";
import { decodeBase64 } from "../../utils/base64";
import { useTranslations } from "next-intl";
import GraphQLFormatter from "./Code";
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

const getHeadersFromParams = (searchParams: URLSearchParams): Header[] => {
  return Array.from(searchParams.entries()).reduce<Header[]>((acc, [key, value]) => {
    if (key !== "method" && key !== "encodedEndpoint" && key !== "encodedData") {
      acc.push({ key, value: decodeURIComponent(value), included: true });
    }
    return acc;
  }, []);
};

const GrafQlContent = () => {
  const t = useTranslations("GraphQl");
  const searchParams = useSearchParams();
  const pathname = usePathname();


  const initialState = useMemo(() => {
    const segments = pathname.split("/");
    const bodyBase64String = segments.pop();
    const endpointBase64String = segments.pop();

    let headers: Header[] = [];
    let currentEndpoint = "";
    let variables: Variable[] = [];
    let schema: object | string | null = null;

    if (endpointBase64String && bodyBase64String) {
      try {
        const decodedUrl = decodeBase64(endpointBase64String);
        const decodedBody = decodeBase64(bodyBase64String);
        const bodyJson = JSON.parse(decodedBody);

        currentEndpoint = decodedUrl;
        variables = bodyJson.variables || [];

        if (bodyJson.body && bodyJson.body.schema) {
          schema = bodyJson.body.schema;

        
        }
        headers = getHeadersFromParams(searchParams);
      } catch (e) {
        console.error("Error decoding body or endpoint:", e);
      }
    }

    console.log("Initial state:", { headers, currentEndpoint, variables, schema});
    return { headers, currentEndpoint, variables, schema };
  }, [pathname, searchParams]);

  const [headers, setHeaders] = useState<Header[]>(initialState.headers);
 
  const [currentMethod, setMethod] = useState<string>("query ");
  const [currentEndpoint, setEndpoint] = useState<string>(initialState.currentEndpoint);
  const [variables, setVariables] = useState<Variable[]>(initialState.variables);

  const [selectedMethod, setSelectedMethod] = useState("query")
  const [schema, setSchema] = useState<object | string>(initialState.schema || selectedMethod);
 
  const [currentBody, setBody] = useState<object | string | null>(null);
  const [isVariablesVisible, setIsVariablesVisible] = useState<boolean>(true);
  const [editorMode, setEditorMode] = useState<"json" | "text">("json");

  const requestHandlerRef = useRef<React.ElementRef<typeof RequestHandler>>(null);
  const requestHandlerSdlRef = useRef<React.ElementRef<typeof RequestHandlerSdl>>(null);
  const [sdlEndpoint, setSdlEndpoint] = useState<string>("");

  
  const sendRequest = useCallback(() => {
    requestHandlerRef.current?.sendRequest();
  }, []);

  const sendRequestSdl = useCallback((endpoint: string) => {
    requestHandlerSdlRef.current?.sendRequest(endpoint);
  }, []);

  useEffect(() => {
    if (schema) {
      setBody((prev) => {
        if (typeof prev === "object" && prev !== null) {
          return {
            ...prev,
            schema: schema,
          };
        } else {
          return { schema: schema };
        }
      });
    }
  }, [schema]);

  useEffect(() => {
    updateURL("graphql", currentEndpoint, currentBody, headers, variables);
  }, [currentEndpoint, headers, variables, currentBody, schema]);



  return (
    <section className={styles.content}>
      <div className={styles.content__inner}>
        <div className={styles.content__wrapper}>
          <h1 className={styles.content__title}>{t("title")}</h1>
          <div className={styles.content__background} />
          <div className={styles.content__inputs}>
            <UrlEditor
            
              setMethod={setSelectedMethod}
      
              currentMethod={selectedMethod}
              currentEndpoint={currentEndpoint}
              setEndpoint={setEndpoint}
              onSendRequest={sendRequest}
              setSchema={setSchema}
            />
            <SdlEditor
              currentMethod={currentMethod}
              setMethod={setMethod}
              currentEndpoint={sdlEndpoint}
              setEndpoint={setSdlEndpoint}
              onSendRequest={sendRequestSdl}
            />
          </div>
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
            {t("variables")} {isVariablesVisible ? "-" : "+"}
          </div>
          {isVariablesVisible && (
            <VariableEditor
              variables={variables}
              setVariables={setVariables}
              body={currentBody as string}
              onUpdateBody={setBody}
            />
          )}
          <QueryEditor
            body={schema}
            title={t("editor")}
          
            variables={variables}
            editorMode={"graphql"}
            setEditorMode={setEditorMode}
            setBlurredBody={setSchema}
            setSchema={setSchema}
            method={currentMethod}
            schema={String(schema)}
          />


          <RequestHandler
            schema={String(schema)}
            method={selectedMethod}
           
            endpoint={currentEndpoint}
            headers={headers}
            body={currentBody}
            editorMode={editorMode}
            variables={variables}
            ref={requestHandlerRef}
         
          />
          <RequestHandlerSdl
            schema={String(schema)}
            method={currentMethod}
            endpoint={sdlEndpoint}
            headers={headers}
            body={currentBody}
            editorMode={editorMode}
            variables={variables}
            ref={requestHandlerSdlRef}
          />
        </div>
      </div>
    </section>
  );
};

export default GrafQlContent;
