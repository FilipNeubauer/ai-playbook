// [GQL]
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../../apps/backend/schema.graphql',
  documents: ['src/api/graphql/documents/**/*.gql'],
  generates: {
    './src/api/graphql/generated.ts': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
};

export default config;
