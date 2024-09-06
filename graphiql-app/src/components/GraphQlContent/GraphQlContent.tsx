








"use client"
import UrlEditor from "./UrlEditor"
import { useState, useEffect, useRef, useCallback } from "react"
import { updateURL } from "../../utils/urlUpdater"
import styles from "./GraphQlContent.module.scss"
import VariableEditor from "./VariablesEditor"
import HeaderEditor from "./HeaderEditor"
import RequestHandler from "./RequestHandler"
import { useParams, useSearchParams, usePathname } from "next/navigation";
import QueryEditor from "./QueryEditor"
import SdlEditor from "./SdlEditor"
import RequestHandlerSdl from "./RequestHandlerSdl"
import { decodeBase64 } from "../../utils/base64";

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
};

const GrafQlContent = () => {
  const searchParams = useSearchParams();
  const [headers, setHeaders] = useState<Header[]>(getHeadersFromParams(searchParams));
  const [currentEndpoint, setEndpoint] = useState("");
  const { method, encodedUrl } = useParams<{ method: string; encodedUrl: string[] }>();
  const [currentMethod, setMethod] = useState<string>(method || "query");
  const [currentBody, setBody] = useState<object | string | null>(null);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [isVariablesVisible, setIsVariablesVisible] = useState<boolean>(true);
  const [editorMode, setEditorMode] = useState<"json" | "text">("json");
  const requestHandlerRef = useRef<React.ElementRef<typeof RequestHandler>>(null);
  const [schema, setSchema] = useState<object | string | null>(null);
  const requestHandlerSdlRef = useRef<React.ElementRef<typeof RequestHandlerSdl>>(null);
  const [sdlEndpoint, setSdlEndpoint] = useState("");
  const pathname = usePathname();

  const sendRequest = useCallback(() => {
    requestHandlerRef.current?.sendRequest();
  }, []);

  const sendRequestSdl = useCallback((endpoint: string) => {
    requestHandlerSdlRef.current?.sendRequest(endpoint);
  }, []);

  useEffect(() => {
    const segments = pathname.split("/");
    const bodyBase64String = segments.pop();
    const endpointBase64String = segments.pop();

    if (endpointBase64String && bodyBase64String) {
      try {
        const decodedUrl = decodeBase64(endpointBase64String);
        const decodedBody = decodeBase64(bodyBase64String);
        const bodyJson = JSON.parse(decodedBody);

        setEndpoint(decodedUrl);
        setVariables(bodyJson.variables);
 
      console.log("SCHEEEEEEEEEEEEEEEEEEEMA", bodyJson.body.schema)
      if (bodyJson.body.schema !== schema) {
          setSchema(bodyJson.body.schema);
      }
     //   }
      } catch (e) {
        console.error("Error decoding body or endpoint:", e);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof currentBody === "object" && currentBody !== null) {
      const currentBodySchema = (currentBody as { schema?: any }).schema;
  
      if (schema !== currentBodySchema) {
        setBody(prev => {
          if (typeof prev === "object" && prev !== null) {
            return {
              ...prev,
              schema: schema,
            };
          } else {
            return {
              schema: schema,
            };
          }
        });
      }
    } else {
      setBody({
        schema: schema,
      });
    }
  }, [schema]);
  

  useEffect(() => {
    updateURL("graphql", currentEndpoint, currentBody, headers, variables);
  }, [currentEndpoint, schema, headers, variables, currentBody]);

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
            Variables {isVariablesVisible ? "-" : "+"}
          </div>
          {isVariablesVisible && (
            <VariableEditor
              variables={variables}
              setVariables={setVariables}
              body={currentBody as string}
              onUpdateBody={setBody}
            />
          )}
          {JSON.stringify(schema)}
          <QueryEditor
            body={schema}
            title={"Request editor"}
            variables={variables}
            editorMode={"graphql"}
            setEditorMode={setEditorMode}
            handleChangeSchema={setSchema}
          />
          <RequestHandler
            schema={String(schema)}
            method={currentMethod}
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



/*
"use client"
import UrlEditor from "./UrlEditor"
import { useState, useEffect, useRef } from "react"
import { updateURL } from "../../utils/urlUpdater"
import styles from "./GraphQlContent.module.scss"
import VariableEditor from "./VariablesEditor"
import HeaderEditor from "./HeaderEditor"
import RequestHandler from "./RequestHandler"
 
import { useParams, useSearchParams, usePathname } from "next/navigation";


 
import QueryEditor from "./QueryEditor"
import SdlEditor from "./SdlEditor"
import RequestHandlerSdl from "./RequestHandlerSdl"

import { decodeBase64 } from "../../utils/base64";




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
};




const GrafQlContent = () => {
 

const searchParams = useSearchParams();
    const [headers, setHeaders] = useState<Header[]>(
      getHeadersFromParams(searchParams),
    );
  const [currentEndpoint, setEndpoint] = useState("")
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
    
  );
  const [isVariablesVisible, setIsVariablesVisible] = useState<boolean>(true);

 
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
  
  const sendRequestSdl = (endpoint: string) => {
    requestHandlerSdlRef.current?.sendRequest(endpoint);
  };
 
useEffect(() => {
  setBody(prev => {
    if (typeof prev === 'object' && prev !== null) {
    
      return {
        ...prev,
        schema: schema
      };
    } else {
     
      return {
        schema: schema
      };
    }
  });
}, [schema]);
  useEffect(() => {
    console.log("BOD", JSON.stringify(currentBody))
    updateURL("graphql", currentEndpoint, currentBody, headers, variables);
  }, [currentEndpoint, schema, headers, variables, currentBody]);


  
 
 
const pathname = usePathname();
useEffect(()=> {
  const segments = pathname.split("/");
  const bodyBase64String = segments.pop();
  const endpointBase64String = segments.pop();

  if (endpointBase64String && bodyBase64String) {
    try {
      const decodedUrl = decodeBase64(endpointBase64String);
     
   //   const decodedBody = decodeBase64(bodyBase64String) as string;
   const decodedBody = decodeBase64(bodyBase64String);
      const bodyJson = JSON.parse(decodedBody);
      console.log("DECODED", decodedUrl, JSON.stringify(decodedBody),"JSON", JSON.stringify(bodyJson))
     console.log( bodyJson.variables )
      setEndpoint(decodedUrl)
      setVariables(bodyJson.variables )
      console.log("SCHEM", bodyJson.body.schema)

    //  if (bodyJson.body.schema !== schema) {
           setSchema(bodyJson.body.schema);
    //    }
    // setSchema(bodyJson.body.schema) работает но вызывает ререндеры
   
    } catch(e) {

    }
  }
}, [pathname, searchParams])
 
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
          {JSON.stringify(schema)}
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
 */

/* http://localhost:5137/GRAPHQL/{endpointUrlBase64encoded}/{bodyBase64encoded}?header1=header1value&header2=header2value...
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

  */