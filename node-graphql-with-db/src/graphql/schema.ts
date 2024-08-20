import { readFileSync } from "node:fs";
import { useDisableIntrospection } from "@graphql-yoga/plugin-disable-introspection";
import { buildSchema } from "graphql";
import { createGraphQLError, createSchema, createYoga } from "graphql-yoga";
import { config } from "~/config";
import { GRAPHQL_ENDPOINT_PATH, GRAPHQL_SCHEMA_FILES } from "~/constants";
import * as queries from "~/db/queries";
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
    messages: async (_, { fromSequenceNumber }) => {
      return queries.getMessages({
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
      const record = await queries.saveMessage({ content: message.content });

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

export const yoga = createYoga<ServerContext, UserContext>({
  schema,
  graphiql: config.ENV === "dev",
  landingPage: false,
  graphqlEndpoint: GRAPHQL_ENDPOINT_PATH,
  plugins: config.ENV === "dev" ? [] : [useDisableIntrospection()],
  context: buildContext,
});
