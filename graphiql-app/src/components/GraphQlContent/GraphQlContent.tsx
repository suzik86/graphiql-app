"use client"
import UrlEditor from "./UrlEditor"
import { useState, useEffect, useRef } from "react"
import { updateURL } from "../../utils/urlUpdater"
import styles from "./GraphQlContent.module.scss"
import VariableEditor from "./VariablesEditor"
import HeaderEditor from "./HeaderEditor"
import RequestHandler from "./RequestHandler"
 
import { useParams, useSearchParams } from "next/navigation";


 
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
 
const GrafQlContent = () => {
 
  const [headers, setHeaders] = useState<Header[]>(
    [{
      key: "",
      value: "",
      included: false
    }]
 
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