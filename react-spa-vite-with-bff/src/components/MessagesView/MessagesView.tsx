import { Button, Card, Group, Text } from '@mantine/core';
import { useEffect } from 'react';
import { useActions, useSelector } from '~/store/react';

export function MessagesView() {
  const actions = useActions();
  const messages = useSelector((state) => state.messagesEntity);

  useEffect(() => {
    actions.loadMessages();
  }, [actions]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>Messages</Text>
      </Group>

      <Text size="sm" c="dimmed">
        {messages.status === 'loading' && 'Loading...'}
        {messages.status === 'error' && 'Error!'}
        {messages.status === 'loaded' && messages.data[0].message}
      </Text>

      <Button fullWidth mt="md" radius="md" onClick={actions.loadMessages}>
        Refresh
      </Button>
    </Card>
  );
}
