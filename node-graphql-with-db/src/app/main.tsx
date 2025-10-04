import { StrictMode, useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ulid } from "ulid";
import "@mantine/core/styles.css";
import {
  MantineProvider,
  Container,
  Stack,
  TextInput,
  Button,
  ScrollArea,
  Paper,
  Text,
  Group,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { GraphQLClientProvider } from "./graphql/client";
import {
  useSubscribeMessagesSubscription,
  useGetMessagesQuery,
  useSendMessageMutation,
} from "./graphql/generated";

const App = () => {
  const [message, setMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useSubscribeMessagesSubscription();
  const [, sendMessage] = useSendMessageMutation();
  const [{ data }] = useGetMessagesQuery();

  useEffect(() => {
    scrollAreaRef.current!.scrollTo({
      top: scrollAreaRef.current!.scrollHeight,
      behavior: "smooth",
    });
  }, [data?.messages]);

  const handleSend = () => {
    const content = message.trim();
    if (content) {
      sendMessage({ input: { content, localId: ulid() } });
      setMessage("");
    }
  };

  return (
    <Container size="md" py="xl">
      <Stack h="80vh">
        <ScrollArea
          viewportRef={scrollAreaRef}
          flex={1}
          p="md"
          style={{
            border: "1px solid #e9ecef",
            borderRadius: "8px",
          }}
        >
          <Stack gap="sm">
            {data?.messages.map((m) => (
              <Paper
                key={m.id}
                shadow="sm"
                p="md"
                withBorder
                style={{
                  backgroundColor: "#f8f9fa",
                }}
              >
                <Text>{m.content}</Text>
                <Text size="xs" c="dimmed" mt="xs">
                  Message #{m.sequence}
                </Text>
              </Paper>
            ))}
          </Stack>
        </ScrollArea>
        <Group>
          <TextInput
            placeholder="Type your message..."
            flex={1}
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend} leftSection={<IconSend size={16} />}>
            Send
          </Button>
        </Group>
      </Stack>
    </Container>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <GraphQLClientProvider>
        <App />
      </GraphQLClientProvider>
    </MantineProvider>
  </StrictMode>,
);
