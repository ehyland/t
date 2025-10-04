import { cacheExchange } from "@urql/exchange-graphcache";
import type { ReactNode } from "react";
import { Client, Provider, fetchExchange } from "urql";
import {
  type GQLMessageFragment,
  type GQLSubscribeMessagesSubscription,
} from "./generated";
import schema from "./generated-introspection-schema.json";
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
            const list = (cache.resolve("Query", "messages") as string[]) ?? [];

            for (const { message } of parent.messageSubscription) {
              const key = cache.keyOfEntity(message);
              if (key) {
                list.push(key);
              }
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
