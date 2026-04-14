// [GQL]
'use client';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

type Props = { children: React.ReactNode };

export function GraphQLProvider({ children }: Props) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
