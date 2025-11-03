import { cacheExchange } from "@urql/exchange-graphcache";
import type { ReactNode } from "react";
import { Client, Provider, fetchExchange } from "urql";
import {
  type GQLGetMessagesQueryVariables,
  type GQLMessageFragment,
  type GQLSubscribeMessagesSubscription,
  type GQLGetMessagesQuery,
  GetMessagesDocument,
} from "./generated";
import schema from "./generated-introspection-schema.ts";
const GRAPHQL_API_URL = `/api/v2/graphql`;

export namespace API {
  export type Message = GQLMessageFragment;
}

export const client = new Client({
  url: GRAPHQL_API_URL,
  fetchSubscriptions: true,
  exchanges: [
    cacheExchange({
      schema: schema,
      updates: {
        Subscription: {
          messageSubscription(
            parent: GQLSubscribeMessagesSubscription,
            _args,
            cache,
          ) {
            cache.updateQuery<
              GQLGetMessagesQuery,
              GQLGetMessagesQueryVariables
            >(
              { query: GetMessagesDocument, variables: { channel: "default" } },
              (data) => {
                return {
                  ...data,
                  __typename: "Query",
                  messages: [
                    ...(data?.messages ?? []),
                    ...parent.messageSubscription.map((m) => m.message),
                  ],
                };
              },
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
});

interface GraphQLClientProviderProps {
  children: ReactNode;
}

export const GraphQLClientProvider = ({
  children,
}: GraphQLClientProviderProps) => {
  return <Provider value={client}>{children}</Provider>;
};
