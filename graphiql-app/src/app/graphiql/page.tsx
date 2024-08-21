
//import { getClient } from "@/config/api";
import { graphql } from "gql.tada";
import {getClient} from "../../../config/api"
const CountriesQuery = graphql(`
  query Countries {
    countries {
      name
      capital
      code
      continent {
        code
        name
      }
      currency
    }
  }
`);


export default async function Home() {
  const { data } = await getClient().query({
    query: CountriesQuery,
    context: {
      fetchOptions: {
        next: { revlidte: 10 },
      },
    },
  });

  return (
    <main className="">
      {data?.countries?.map((country: any, index: number) => {
        return (
          <div key={index} className="border-white border-b-2">
            <ul>
              <li>{country?.name}</li>
              <li>{country?.code}</li>
            </ul>
          </div>
        );
      })}
    </main>
  );
}

/*
const GraphiqlPage = () => {
    return ( <>
    graf
    </> );
}
 
export default GraphiqlPage;

*/