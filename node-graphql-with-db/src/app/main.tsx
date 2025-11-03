import { StrictMode, useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ulid } from "ulid";
import "@mantine/core/styles.css";
import {
  MantineProvider,
  Box,
  Container,
  Stack,
  TextInput,
  Button,
  ScrollArea,
  Paper,
  Text,
  Group,
  Title,
  Divider,
  ThemeIcon,
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
  const [{ data }] = useGetMessagesQuery({ variables: { channel: "default" } });

  useEffect(() => {
    const viewport = scrollAreaRef.current;
    if (!viewport) return;
    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: "smooth",
    });
  }, [data?.messages]);

  const handleSend = () => {
    const content = message.trim();
    if (content) {
      sendMessage({ input: { content, localId: ulid(), channel: "default" } });
      setMessage("");
    }
  };

  return (
    <Box bg="gray.1" mih="100vh" py="lg">
      <Container size="md">
        <Paper radius="lg" shadow="lg" p="lg" withBorder bg="white">
          <Stack h="65vh" gap="lg">
            <Stack gap="sm">
              <Group justify="space-between" align="flex-start">
                <div>
                  <Title order={2}>Channel #default</Title>
                  <Text size="sm" c="dimmed">
                    Chat in real time with automatic updates.
                  </Text>
                </div>
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan" }}
                  size="xl"
                  radius="lg"
                >
                  <IconSend size={22} />
                </ThemeIcon>
              </Group>
              <Divider variant="dashed" my={0} />
            </Stack>
            <ScrollArea
              viewportRef={scrollAreaRef}
              flex={1}
              px={0}
              py="xs"
              type="auto"
            >
              <Stack gap="xs" justify="flex-end">
                {data?.messages.map((m) => (
                  <Paper
                    key={m.id}
                    withBorder
                    shadow="xs"
                    radius="md"
                    p="sm"
                    bg="white"
                  >
                    <Text fw={500}>{m.content}</Text>
                    <Text size="xs" c="dimmed" mt={4}>
                      Message #{m.sequence}
                    </Text>
                  </Paper>
                ))}
              </Stack>
            </ScrollArea>
            <Paper withBorder radius="md" p="sm" bg="gray.0">
              <Group align="flex-end" gap="sm" wrap="nowrap">
                <TextInput
                  placeholder="Type your message..."
                  flex={1}
                  value={message}
                  radius="md"
                  size="sm"
                  variant="filled"
                  onChange={(e) => setMessage(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSend();
                    }
                  }}
                />
                <Button
                  onClick={handleSend}
                  leftSection={<IconSend size={16} />}
                  radius="md"
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan" }}
                  size="sm"
                >
                  Send
                </Button>
              </Group>
            </Paper>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="light">
      <GraphQLClientProvider>
        <App />
      </GraphQLClientProvider>
    </MantineProvider>
  </StrictMode>,
);
