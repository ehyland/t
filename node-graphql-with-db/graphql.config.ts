import type { CodegenConfig } from "@graphql-codegen/cli";
import type { IGraphQLConfig } from "graphql-config";
import { GRAPHQL_SCHEMA_FILES } from "./src/server/constants";

const config = {
  projects: {
    api: {
      schema: GRAPHQL_SCHEMA_FILES,
      exclude: ["**/generated.ts"],
      extensions: {
        codegen: {
          overwrite: true,
          generates: {
            "src/server/graphql/generated.ts": {
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
                //   Message: "~/server/models#Message",
                // },
                contextType: "~/server/graphql/context#Context",
              },
            },
          },
        } satisfies CodegenConfig,
      },
    },
    "test-client": {
      schema: GRAPHQL_SCHEMA_FILES,
      exclude: ["**/generated.ts"],
      documents: ["src/server/test/utils/client/operations/**/*.graphql"],
      extensions: {
        codegen: {
          overwrite: true,
          generates: {
            "src/server/test/utils/client/generated.ts": {
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
    app: {
      schema: GRAPHQL_SCHEMA_FILES,
      exclude: ["**/generated.ts"],
      documents: ["src/app/graphql/operations.graphql"],
      extensions: {
        codegen: {
          overwrite: true,
          generates: {
            "src/app/graphql/generated.ts": {
              plugins: [
                "@graphql-codegen/typescript",
                "@graphql-codegen/typescript-operations",
                "@graphql-codegen/typescript-urql",
              ],
              config: {
                maybeValue: "T | undefined",
                withHooks: false,
                enumsAsTypes: true,
                strictScalars: true,
                typesPrefix: "GQL",
                useTypeImports: true,
                useIndexSignature: true,
                scalars: {
                  Date: "string",
                  DateTime: "string",
                  ISO8601DateTime: "string",
                  Time: "string",
                },
              },
            },
          },
        } satisfies CodegenConfig,
      },
    },
  },
} satisfies IGraphQLConfig;

export default config;
