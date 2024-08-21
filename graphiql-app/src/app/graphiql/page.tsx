
"use client"
import { useState } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { graphql } from "gql.tada";

export default function Home() {
  const [url, setUrl] = useState(""); 
  const [schema, setSchema] = useState("");  
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
      const { data } = await client.query({
        query: CustomQuery,
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
      <form onSubmit={handleSubmit} className="mb-4">
        <div>
          <label>GraphQL API URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 mb-2 w-full"
            placeholder="Введите URL API"
            required
          />
        </div>
        <div>
          <label>GraphQL Schema:</label>
          <textarea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            className="border p-2 mb-2 w-full"
            placeholder="Введите GraphQL схему"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Выполнить запрос
        </button>
      </form>
DATA {JSON.stringify(data) }
      {data && data.countries && (
        <div>
          {data.countries.map((country: any, index: number) => (
            <div key={index} className="border-white border-b-2">
              <ul>
                <li>{country.name}</li>
                <li>{country.code}</li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
 