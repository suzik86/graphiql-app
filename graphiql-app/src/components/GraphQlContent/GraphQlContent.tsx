 
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


  


function extractBodyAndVariables(
  encodedData: string | undefined,
): ExtractedData {
  if (!encodedData) {
    return { body: null, variables: [] };
  }

  try {
    const decodedString = decodeBase64(encodedData);
    const dataObject = JSON.parse(decodedString);
    const body = dataObject.body || null;
    const variables = dataObject.variables || [];

    return { body, variables };
  } catch (error) {
    console.error("Error decoding or parsing data:", error);
    return { body: null, variables: [] };
  }
}




/*
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
*/
const pathname = usePathname();
useEffect(()=> {
  const segments = pathname.split("/");
  const bodyBase64String = segments.pop();
  const endpointBase64String = segments.pop();

  if (endpointBase64String && bodyBase64String) {
    try {
      const decodedUrl = decodeBase64(endpointBase64String);
      /*
      DECODED savda "{\"body\":\"{\\n  \\\"csa\\\": \\\"{{csa}}\\\"\\n}\",\"variables\":[{\"key\":\"csa\",\"value\":\"sca\",\"included\":true}]}" JSON {"body":"{\n  \"csa\": \"{{csa}}\"\n}","variables":[{"key":"csa","value":"sca","included":true}]}
      */
   //   const decodedBody = decodeBase64(bodyBase64String) as string;
   const decodedBody = decodeBase64(bodyBase64String);
      const bodyJson = JSON.parse(decodedBody);
      console.log("DECODED", decodedUrl, JSON.stringify(decodedBody),"JSON", JSON.stringify(bodyJson))
     console.log( bodyJson.variables )
      setEndpoint(decodedUrl)
      setVariables(bodyJson.variables )
   //   setVariables
    } catch(e) {

    }
  }
}, [pathname, searchParams])
/*
const encodedUrlArray = Array.isArray(encodedUrl) ? encodedUrl : [];
console.log("ENCODED URL ARRAY", encodedUrlArray)
let endpoint = "";
 
let initialVariables: Variable[] = [];

if (encodedUrlArray.length === 1) {
  const singleEncoded = encodedUrlArray[0];
  const decodedString = decodeBase64(singleEncoded);

  try {
    const parsedData = JSON.parse(decodedString);

    if (
      parsedData &&
      typeof parsedData === "object" &&
      !Array.isArray(parsedData)
    ) {
      body = parsedData.body || null;
      initialVariables = parsedData.variables || [];
      console.log("DECODEEEEEE", body, initialVariables)
    } else {
      endpoint = decodedString;
    }
  } catch (error) {
    console.error("Error parsing single encoded parameter:", error);
    endpoint = decodedString;
  }
} else if (encodedUrlArray.length === 2) {
  const [encodedEndpoint, encodedData] = encodedUrlArray;
  endpoint = decodeBase64(encodedEndpoint);
  const extractedData = extractBodyAndVariables(encodedData);
  body = extractedData.body;
  initialVariables = extractedData.variables;
}
useEffect(() => {
  updateURL(currentMethod, currentEndpoint, blurredBody, headers, variables);
}, [blurredBody]); */
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