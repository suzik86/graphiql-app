//import * as gqlTada from "gql.tada";
declare const introspection: {
  __schema: {
    /*...*/
  };
};

declare module "gql.tada" {
  interface setupSchema {
    introspection: typeof introspection;
  }
}
