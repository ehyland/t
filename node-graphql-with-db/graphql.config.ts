import type { CodegenConfig } from "@graphql-codegen/cli";
import type { IGraphQLConfig } from "graphql-config";
import { GRAPHQL_SCHEMA_FILES } from "./src/constants";

const config = {
  projects: {
    api: {
      schema: GRAPHQL_SCHEMA_FILES,
      exclude: ["**/generated.ts"],
      extensions: {
        codegen: {
          overwrite: true,
          generates: {
            "src/graphql/generated.ts": {
              plugins: [
                "@graphql-codegen/typescript",
                "@graphql-codegen/typescript-resolvers",
              ],
              config: {
                useIndexSignature: true,
                strictScalars: true,
                enumsAsTypes: true,
                typesPrefix: "GQL",
                useTypeImports: true,
                // mappers: {
                //   Message: "~/models#Message",
                // },
                contextType: "~/graphql/context#Context",
              },
            },
          },
        } satisfies CodegenConfig,
      },
    },
    "test-client": {
      schema: GRAPHQL_SCHEMA_FILES,
      exclude: ["**/generated.ts"],
      documents: ["src/test/utils/client/operations/**/*.graphql"],
      extensions: {
        codegen: {
          overwrite: true,
          generates: {
            "src/test/utils/client/generated.ts": {
              plugins: [
                "@graphql-codegen/typescript",
                "@graphql-codegen/typescript-operations",
                "@graphql-codegen/typescript-document-nodes",
                "@graphql-codegen/typescript-graphql-request",
              ],
              config: {
                useIndexSignature: true,
                strictScalars: true,
                enumsAsTypes: true,
                typesPrefix: "GQL",
                useTypeImports: true,
                rawRequest: true,
              },
            },
          },
        } satisfies CodegenConfig,
      },
    },
  },
} satisfies IGraphQLConfig;

export default config;
