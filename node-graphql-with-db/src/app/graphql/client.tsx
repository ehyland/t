import type { ReactNode } from "react";
import { Client, Provider, fetchExchange } from "urql";
import {
  cacheExchange,
  type NullArray,
  type Scalar,
} from "@urql/exchange-graphcache";
import { type GQLSubscribeMessagesSubscription } from "./generated";
const GRAPHQL_API_URL = `/api/v2/graphql`;

export const client = new Client({
  url: GRAPHQL_API_URL,
  fetchSubscriptions: true,
  exchanges: [
    cacheExchange({
      updates: {
        Subscription: {
          messageSubscription(
            parent: GQLSubscribeMessagesSubscription,
            _args,
            cache
          ) {
            const list =
              (cache.resolve("Query", "messages") as Array<string>) || [];
            for (const { message } of parent.messageSubscription) {
              list.push(`${message.__typename}:${message.id}`);
            }
            cache.link("Query", "messages", list);
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
