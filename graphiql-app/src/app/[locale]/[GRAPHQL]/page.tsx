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



  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: url,
        headers: JSON.parse(headers), 
      }),
    });

    const CustomQuery = graphql(schema);
    try {
        const parsedVariables = JSON.parse(variables); 
      const { data } = await client.query({
        query: CustomQuery,
        variables: parsedVariables, 
        context: {
          fetchOptions: {
            next: { revalidate: 10 },
          },
        },
      });
      setData(data);
    } catch (error) {
      console.error("Ошибка запроса:", error);
    }
 
    
    const encodedUrl = encodeBase64(url);
    const requestBody = JSON.stringify({
      schema,
      variables: JSON.parse(variables),
    });
    const encodedBody = encodeBase64(requestBody);

 
    const parsedHeaders = JSON.parse(headers);
    const queryParams = new URLSearchParams(parsedHeaders).toString();
 
    const graphqlUrl = `/${localActive}/GRAPHQL/${encodedUrl}/${encodedBody}?${queryParams}`;
 console.log("E", graphqlUrl)
    router.push(graphqlUrl);
  };
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
            {/*
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
            */}
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
/*


"use client";
import { useState } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { graphql } from "gql.tada";

export default function Home() {
  const [url, setUrl] = useState(""); 
  const [schema, setSchema] = useState("");  
  const [variables, setVariables] = useState<string>("{}");  
  const [data, setData] = useState<any>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: url,
      }),
    });

    const CustomQuery = graphql(schema);

    try {
      const parsedVariables = JSON.parse(variables); 
      const { data } = await client.query({
        query: CustomQuery,
        variables: parsedVariables, 
        context: {
          fetchOptions: {
            next: { revalidate: 10 },
          },
        },
      });
      setData(data);
    } catch (error) {
      console.error("Ошибка запроса:", error);
    }
  };

  return (
    <main className="">
      <form onSubmit={handleSubmit}>
        <div>
          <label>GraphQL API URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Введите URL API"
            required
          />
        </div>
        <div>
          <label>GraphQL Schema:</label>
          <textarea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            placeholder="Введите GraphQL схему"
            required
          />
        </div>
        <div>
          <label>Variables (JSON):</label>
          <textarea
            value={variables}
            onChange={(e) => setVariables(e.target.value)}
            placeholder='Введите переменные в формате JSON, например: {"id": "123"}'
            required
          />
        </div>
        <button type="submit">
          Выполнить запрос
        </button>
      </form>

      <div>
        <h2>DATA</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </main>
  );
}
  */

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
console.log("ENCODED",encodedUrl, encodedBody)
    if (encodedUrl && encodedBody) {
      const url = Buffer.from(encodedUrl, 'base64').toString('utf8');
      const requestBody = JSON.parse(Buffer.from(encodedBody, 'base64').toString('utf8'));

      const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
          uri: url,
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
*/

/*
const Graf = () => {
    return ( <>
    graf
    </> );
}
 
export default Graf;

*/