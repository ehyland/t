import { readFileSync } from "node:fs";
import { useDisableIntrospection } from "@graphql-yoga/plugin-disable-introspection";
import { buildSchema } from "graphql";
import { createGraphQLError, createSchema, createYoga } from "graphql-yoga";
import { config, DEFAULT_INTROSPECTION_ACCESS_KEY } from "~/server/config";
import {
  GRAPHQL_ENDPOINT_PATH,
  GRAPHQL_SCHEMA_FILES,
} from "~/server/constants";
import * as queries from "~/server/db/queries";
import {
  type Context,
  type ServerContext,
  type UserContext,
  buildContext,
} from "./context";
import type { GQLIncomingMessage, GQLResolvers } from "./generated";

const resolvers = {
  Query: {
    message: async (_, { id }) => {
      const message = await queries.getMessage({
        id,
      });

      if (message === undefined) throw createGraphQLError("message not found");

      return message;
    },
    messages: async (_, { fromSequenceNumber, channel }) => {
      return queries.getMessages({
        channel: channel,
        fromSequenceNumber: fromSequenceNumber ?? 0,
      });
    },
  },
  Subscription: {
    messageSubscription: {
      subscribe: async function* (_, __, { pubSub }) {
        for await (const messages of pubSub.events("messages")) {
          yield {
            messageSubscription: messages.map(
              (message) =>
                ({
                  localId: message.localId,
                  message: message.record,
                }) satisfies GQLIncomingMessage,
            ),
          };
        }
      },
    },
  },
  Mutation: {
    sendMessage: async (_, { message }, { pubSub }) => {
      const record = await queries.saveMessage({
        channel: message.channel,
        content: message.content,
      });

      pubSub.emit("messages", [{ localId: message.localId, record }]);

      return {
        localId: message.localId,
        message: record,
      };
    },
  },
} satisfies GQLResolvers;

const typeDefs = buildSchema(
  GRAPHQL_SCHEMA_FILES.map((file) => readFileSync(file, "utf8")).join("\n"),
);

const schema = createSchema<Context>({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

if (
  config.GRAPHQL_INTROSPECTION_ACCESS_KEY === DEFAULT_INTROSPECTION_ACCESS_KEY
) {
  console.warn(
    "⚠️  GRAPHQL_INTROSPECTION_ACCESS_KEY is set to the default value, this is public and must be changed in production",
  );
}

export const yoga = createYoga<ServerContext, UserContext>({
  schema,
  graphiql: config.ENABLE_GRAPHIQL,
  landingPage: false,
  graphqlEndpoint: GRAPHQL_ENDPOINT_PATH,
  plugins: [
    useDisableIntrospection({
      isDisabled: (request) => {
        switch (config.GRAPHQL_INTROSPECTION_ACCESS_KEY) {
          case "":
          case request.headers.get("x-allow-introspection"):
            return false;
          default:
            return true;
        }
      },
    }),
  ],
  context: buildContext,
});
