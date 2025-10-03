import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ulid } from "ulid";
import { GraphQLClientProvider } from "./graphql/client";
import {
  useSubscribeMessagesSubscription,
  useGetMessagesQuery,
  useSendMessageMutation,
} from "./graphql/generated";

const App = () => {
  useSubscribeMessagesSubscription();
  const [, sendMessage] = useSendMessageMutation();
  const [{ data }] = useGetMessagesQuery();

  return (
    <GraphQLClientProvider>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const content = formData.get("content") as string;
          sendMessage({ input: { content, localId: ulid() } });
          e.currentTarget.reset();
        }}
      >
        <input name="content" type="text" defaultValue="" />
      </form>
      <ul>
        {data?.messages.map((m) => (
          <li key={m.id}>{m.content}</li>
        ))}
      </ul>
    </GraphQLClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GraphQLClientProvider>
      <App />
    </GraphQLClientProvider>
  </StrictMode>
);
