import { Container, Flex, Stack, Title } from '@mantine/core';
import { ChooseColorScheme, MessagesView } from '~/components';

export const AppLayout = () => {
  return (
    <>
      <Stack>
        <Container w="100%">
          <Flex direction="row" justify="space-between" gap="md" pt="xl">
            <Title order={1} ta="center" fw="bold" c="green">
              The Example App
            </Title>
            <ChooseColorScheme />
          </Flex>
        </Container>
        <Container w="100%">
          <MessagesView />
        </Container>
      </Stack>
    </>
  );
};
