

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
