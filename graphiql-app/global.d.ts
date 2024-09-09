declare const introspection: {
  __schema: object;
};


declare module "gql.tada" {
  interface setupSchema {
    introspection: typeof introspection;
  }
}
