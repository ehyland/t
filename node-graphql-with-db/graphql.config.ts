import type { CodegenConfig } from "@graphql-codegen/cli";
import type { IGraphQLConfig } from "graphql-config";
import { GRAPHQL_SCHEMA_FILES } from "./src/server/constants";
import type { TypeScriptPluginConfig } from "@graphql-codegen/typescript";
import type { TypeScriptDocumentsPluginConfig } from "@graphql-codegen/typescript-operations";
import type { plugin as requestPlugin } from "@graphql-codegen/typescript-graphql-request";
import type { TypeScriptDocumentNodesRawPluginConfig } from "@graphql-codegen/typescript-document-nodes";
import type { plugin as urqlPlugin } from "@graphql-codegen/typescript-urql";
import type { TypeScriptResolversPluginConfig } from "@graphql-codegen/typescript-resolvers";
import { PluginFunction } from "@graphql-codegen/plugin-helpers";

const pluginConfigs = {
  document: {} satisfies TypeScriptDocumentNodesRawPluginConfig,
  request: {
    rawRequest: true,
  } satisfies typeof requestPlugin extends PluginFunction<infer x> ? x : never,
  urql: {
    withHooks: true,
  } satisfies typeof urqlPlugin extends PluginFunction<infer x> ? x : never,
  resolvers: {
    useIndexSignature: true,
    contextType: "~/server/graphql/context#Context",
    // mappers: {
    //   Message: "~/server/models#Message",
    // },
  } satisfies TypeScriptResolversPluginConfig,
  operations: {} satisfies TypeScriptDocumentsPluginConfig,
  typescript: {
    strictScalars: true,
    enumsAsTypes: true,
    typesPrefix: "GQL",
    useTypeImports: true,
    maybeValue: "T | undefined",
    scalars: {
      Date: "string",
      DateTime: "string",
      ISO8601DateTime: "string",
      Time: "string",
    },
  } satisfies TypeScriptPluginConfig,
};

const config = {
  schema: GRAPHQL_SCHEMA_FILES,
  exclude: ["**/generated.ts"],
  documents: ["src/app/graphql/operations.graphql"],
  extensions: {
    codegen: {
      overwrite: true,
      generates: {
        "src/server/graphql/generated.ts": {
          plugins: [
            "@graphql-codegen/typescript",
            "@graphql-codegen/typescript-resolvers",
          ],
        },
        "src/server/test/utils/client/generated.ts": {
          plugins: [
            "@graphql-codegen/typescript",
            "@graphql-codegen/typescript-operations",
            "@graphql-codegen/typescript-document-nodes",
            "@graphql-codegen/typescript-graphql-request",
          ],
        },
        "src/app/graphql/generated.ts": {
          plugins: [
            "@graphql-codegen/typescript",
            "@graphql-codegen/typescript-operations",
            "@graphql-codegen/typescript-urql",
          ],
        },
        "src/app/graphql/generated-introspection-schema.ts": {
          plugins: ["@graphql-codegen/urql-introspection"],
        },
      },
      config: Object.values(pluginConfigs).reduce(
        (acc, values) => Object.assign(acc, values),
        {},
      ),
    } satisfies CodegenConfig,
  },
} satisfies IGraphQLConfig;

export default config;
