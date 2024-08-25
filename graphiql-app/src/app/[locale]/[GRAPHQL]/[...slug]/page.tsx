

"use client";
import { useEffect, useState } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { graphql } from "gql.tada";
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from "next-intl";
import CodeEditor from "../../../../components/CodePlayGround/CodePlayGround";

export default function Home() {

    const t = useTranslations("HomePage");
    const localActive = useLocale();
    const [url, setUrl] = useState("");
    const [schema, setSchema] = useState("");
    const [variables, setVariables] = useState<string>("{}");
    const [headers, setHeaders] = useState<string>("{}");

    const router = useRouter();

    const encodeBase64 = (input: string) => {
        return Buffer.from(input).toString('base64');
    };
    const [data, setData] = useState<string | null>("")



    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const encodedUrl = encodeBase64(url);
        const requestBody = JSON.stringify({
            schema,
            variables: JSON.parse(variables),
        });
        const encodedBody = encodeBase64(requestBody);


        const parsedHeaders = JSON.parse(headers);
        const queryParams = new URLSearchParams(parsedHeaders).toString();

        const graphqlUrl = `/${localActive}/GRAPHQL/${encodedUrl}/${encodedBody}?${queryParams}`;

        const client = new ApolloClient({
            cache: new InMemoryCache(),
            link: new HttpLink({
                uri: url,
                headers: JSON.parse(headers),
            }),
        });



        const CustomQuery = graphql(schema);

        const operationType = schema.includes("query") ? "query" : "mutation"
        try {
            const parsedVariables = JSON.parse(variables);

            if (operationType === 'query') {
                const { data } = await client.query({
                    query: CustomQuery,
                    variables: parsedVariables,
                    context: {
                        fetchOptions: {
                            next: { revalidate: 10 },
                        },
                    },
                });
                localStorage.setItem("graphiql", JSON.stringify({ url: graphqlUrl, response: data }));
            } else if (operationType === 'mutation') {
                const { data } = await client.mutate({
                    mutation: CustomQuery,
                    variables: parsedVariables,
                    context: {
                        fetchOptions: {
                            next: { revalidate: 10 },
                        },
                    },
                });
                localStorage.setItem("graphiql", JSON.stringify({ url: graphqlUrl, response: data }));
            } else {
                console.error("Unsupported operation type:", operationType);
            }
        } catch (error) {
            console.error("Ошибка запроса:", error);
        }

        router.push(graphqlUrl);
    };
    useEffect(() => {
        setData(localStorage.getItem('graphiql'))

    }, [handleSubmit, router])
    return (
        <main>

{/*
            <CodeEditor />
            */}

            <form onSubmit={handleSubmit}>

                <div>
                    <label>GraphQL API URL:</label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter API URL"
                        required
                    />
                </div>

                <div>
                    <label>GraphQL Schema:</label>
                    <textarea
                        value={schema}
                        onChange={(e) => setSchema(e.target.value)}
                        placeholder="Enter GraphQL schema"
                        required
                    />
                </div>
                <div>
                    <label>Variables (JSON):</label>
                    <textarea
                        value={variables}
                        onChange={(e) => setVariables(e.target.value)}
                        placeholder='Enter variables in JSON format, e.g., {"id": "123"}'
                        required
                    />
                </div>
                <div>
                    <label>Headers (JSON):</label>
                    <textarea
                        value={headers}
                        onChange={(e) => setHeaders(e.target.value)}
                        placeholder='Enter headers'
                        required
                    />
                </div>
                <button type="submit">
                    Execute Request
                </button>
            </form>

            <div>
                <h2>DATA</h2>
                {data}

            </div>





        </main>
    );
}

/*
"use client";
import { useEffect, useState } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { graphql } from "gql.tada";
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from "next-intl";

export default function Home() {
const t = useTranslations("HomePage");
const localActive = useLocale();
const [url, setUrl] = useState(""); 
const [schema, setSchema] = useState("");  
const [variables, setVariables] = useState<string>("{}");  
const [headers, setHeaders] = useState<string>("{}");
const [data, setData] = useState<any>(null);
const [requestType, setRequestType] = useState("query");  
const router = useRouter();

const encodeBase64 = (input: string) => {
return Buffer.from(input).toString('base64');
};

const decodeBase64 = (input: string) => {
return Buffer.from(input, 'base64').toString('utf8');
};

const handleSubmit = async (event: React.FormEvent) => {
event.preventDefault();

const encodedUrl = encodeBase64(url);
const requestBody = JSON.stringify({
  schema,
  variables: JSON.parse(variables),
});
const encodedBody = encodeBase64(requestBody);

const parsedHeaders = JSON.parse(headers);
const queryParams = new URLSearchParams(parsedHeaders).toString();

const graphqlUrl = `/${localActive}/GRAPHQL/${encodedUrl}/${encodedBody}?${queryParams}`;

router.push(graphqlUrl);
};

const searchParams = useSearchParams();
useEffect(() => {
const encodedUrl = searchParams.get('encodedUrl');
const encodedBody = searchParams.get('encodedBody');
console.log("ENCODED", encodedUrl, encodedBody);
 
if (encodedUrl && encodedBody) {
  const decodedUrl = decodeBase64(encodedUrl);
  const requestBody = JSON.parse(decodeBase64(encodedBody));
console.log("DECODE", decodedUrl, requestBody)
  setUrl(decodedUrl);
  setSchema(requestBody.schema);
  setVariables(JSON.stringify(requestBody.variables, null, 2));

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: decodedUrl,
      headers: JSON.parse(headers), 
    }),
  });

  const CustomRequest = graphql(requestBody.schema);

  const fetchData = async () => {
    try {
      let result;

      if (requestType === "query") {
        result = await client.query({
          query: CustomRequest,
          variables: requestBody.variables,
          context: {
            fetchOptions: {
              next: { revalidate: 10 },
            },
          },
        });
      } else if (requestType === "mutation") {
        result = await client.mutate({
          mutation: CustomRequest,
          variables: requestBody.variables,
          context: {
            fetchOptions: {
              next: { revalidate: 10 },
            },
          },
        });
      }

      setData(result!.data);
    } catch (error) {
      console.error("Request Error:", error);
    }
  };

  fetchData();
}
}, [router, headers, requestType]);

return (
<main>
  <form onSubmit={handleSubmit}>
    <div>
      <label>GraphQL API URL:</label>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter API URL"
        required
      />
    </div>
    <div>
      <label>Request Type:</label>
      <select
        value={requestType}
        onChange={(e) => setRequestType(e.target.value)}
        required
      >
        <option value="query">Query</option>
        <option value="mutation">Mutation</option>
      </select>
    </div>
    <div>
      <label>GraphQL Schema:</label>
      <textarea
        value={schema}
        onChange={(e) => setSchema(e.target.value)}
        placeholder="Enter GraphQL schema"
        required
      />
    </div>
    <div>
      <label>Variables (JSON):</label>
      <textarea
        value={variables}
        onChange={(e) => setVariables(e.target.value)}
        placeholder='Enter variables in JSON format, e.g., {"id": "123"}'
        required
      />
    </div>
    <div>
      <label>Headers (JSON):</label>
      <textarea
        value={headers}
        onChange={(e) => setHeaders(e.target.value)}
        placeholder='Enter headers'
        required
      />
    </div>
    <button type="submit">
      Execute Request
    </button>
  </form>

  <div>
    <h2>DATA</h2>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
  </main>
);
}


const Encod = () => {
return ( <>
Encoded
</> );
}
 
export default Encod;
    */