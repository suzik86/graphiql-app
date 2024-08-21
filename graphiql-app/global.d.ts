declare const introspection: {
    __schema: { /*...*/ };
  };
  
  import * as gqlTada from 'gql.tada';
  
  declare module 'gql.tada' {
    interface setupSchema {
      introspection: typeof introspection;
    }
  }