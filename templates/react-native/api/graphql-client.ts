// [GQL]
import { ApolloClient, InMemoryCache } from '@apollo/client';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const apolloClient = new ApolloClient({
  uri: `${API_URL}/graphql`,
  cache: new InMemoryCache(),
});
