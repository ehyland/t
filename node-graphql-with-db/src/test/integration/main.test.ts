import { print } from "graphql";
import { createClient } from "graphql-sse";
import { from } from "ix/asynciterable";
import { range } from "remeda";
import invariant from "tiny-invariant";
import { ulid } from "ulid";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { db } from "~/db/db";
import * as testUtils from "~/test/utils";
import {
  type GQLIncomingMessageFragment,
  type GQLSubscribeMessagesSubscription,
  SubscribeMessagesDocument,
} from "../utils/client/generated";

testUtils.installDB();
const { client, fetch, MOCK_BASE_URL } = testUtils.installServer();

describe("Get /readiness", () => {
  it("returns 200", async () => {
    const response = await fetch(`${MOCK_BASE_URL}/readiness`, {
      redirect: "manual",
    });

    expect(response.status).toEqual(200);
  });
});

describe("graphql", () => {
  type SendResponse = Awaited<ReturnType<typeof client.SendMessage>>;

  describe("mutation SendMessage", () => {
    describe("when the first valid message is sent", () => {
      let firstSendResponse: SendResponse;
      const getMessage = (response: SendResponse) =>
        response.data.sendMessage.message;

      beforeEach(async () => {
        firstSendResponse = await client.SendMessage({
          input: { content: "Hello", localId: "1234" },
        });
      });

      it("responds with message", async () => {
        expectEqual(getMessage(firstSendResponse), {
          id: expect.any(String),
          content: "Hello",
          sequence: 1,
        });
      });

      it("is persisted to DB", async () => {
        const result = await db.query.messageTable.findFirst({
          where: (cols, { eq }) =>
            eq(cols.id, getMessage(firstSendResponse).id),
        });
        expect(result).toBeDefined();
      });

      it("makes message available via getMessages endpoint", async () => {
        const getMessagesResponse = await client.GetMessages();
        expect(getMessagesResponse.data.messages).toEqual([
          {
            id: getMessage(firstSendResponse).id,
            content: "Hello",
            sequence: 1,
          },
        ]);
      });

      it("makes message available via getMessage endpoint", async () => {
        const getMessageResponse = await client.GetMessage({
          id: getMessage(firstSendResponse).id,
        });
        expect(getMessageResponse.data.message).toEqual({
          id: getMessage(firstSendResponse).id,
          content: "Hello",
          sequence: 1,
        });
      });

      describe("when the seconds valid message is sent", () => {
        let secondSendResponse: SendResponse;

        beforeEach(async () => {
          secondSendResponse = await client.SendMessage({
            input: { content: "Hi", localId: "5678" },
          });
        });

        it("has the next sequence id", () => {
          expect(getMessage(secondSendResponse).sequence).toEqual(2);
        });

        it("is persisted to DB", async () => {
          const result = await db.query.messageTable.findFirst({
            where: (cols, { eq }) =>
              eq(cols.id, getMessage(secondSendResponse).id),
          });
          expect(result).toBeDefined();
        });

        it("makes message available via getMessage endpoint", async () => {
          const getMessageResponse = await client.GetMessage({
            id: getMessage(secondSendResponse).id,
          });
          expect(getMessageResponse.data.message).toEqual({
            id: getMessage(secondSendResponse).id,
            content: "Hi",
            sequence: 2,
          });
        });

        it("is tracks latest sequence in DB", async () => {
          const result = await db.query.sequenceTable.findFirst({
            where: (cols, { eq }) => eq(cols.partitionKey, "message"),
          });
          expect(result?.lastUsedSequence).toEqual(2);
        });
      });
    });

    describe("with many concurrent messages sent", () => {
      let bulkSendResponses: SendResponse[];

      beforeEach(async () => {
        bulkSendResponses = await Promise.all(
          range(1, 21).map((i) => {
            return client.SendMessage({
              input: { content: `Bulk message ${i}`, localId: `l_${i}` },
            });
          }),
        );
      });

      it("creates all message", () => {
        expect(bulkSendResponses.length).toBe(20);
      });

      it("respects the send sequence", () => {
        expect(
          bulkSendResponses.map((r) => r.data.sendMessage.message.sequence),
        ).toEqual([
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        ]);
      });

      it("messages can be fetched in order", async () => {
        const messages = await client.GetMessages();
        expect(messages.data.messages.map((m) => m.content)).toEqual([
          "Bulk message 1",
          "Bulk message 2",
          "Bulk message 3",
          "Bulk message 4",
          "Bulk message 5",
          "Bulk message 6",
          "Bulk message 7",
          "Bulk message 8",
          "Bulk message 9",
          "Bulk message 10",
          "Bulk message 11",
          "Bulk message 12",
          "Bulk message 13",
          "Bulk message 14",
          "Bulk message 15",
          "Bulk message 16",
          "Bulk message 17",
          "Bulk message 18",
          "Bulk message 19",
          "Bulk message 20",
        ]);
      });

      it("can fetch messages from a specific sequence", async () => {
        const fetchAfter = bulkSendResponses.find(
          (m) => m.data.sendMessage.message.content === "Bulk message 14",
        );

        invariant(fetchAfter);

        const messages = await client.GetMessages({
          fromSequenceNumber: fetchAfter.data.sendMessage.message.sequence + 1,
        });
        expect(messages.data.messages.map((m) => m.content)).toEqual([
          "Bulk message 15",
          "Bulk message 16",
          "Bulk message 17",
          "Bulk message 18",
          "Bulk message 19",
          "Bulk message 20",
        ]);
      });
    });
  });

  describe("subscription messageSubscription", () => {
    let sseClient: ReturnType<typeof createClient>;
    let eventsReceived: GQLIncomingMessageFragment[];
    const receiver = vi.fn((message: GQLIncomingMessageFragment) => {
      eventsReceived.push(message);
    });

    beforeEach(async () => {
      sseClient = createClient({
        url: `${MOCK_BASE_URL}/api/v2/graphql`,
        abortControllerImpl: AbortController,
      });
      const subscription = sseClient.iterate<GQLSubscribeMessagesSubscription>({
        query: print(SubscribeMessagesDocument),
      });

      eventsReceived = [];

      from(subscription).forEach((value) => {
        for (const received of value.data?.messageSubscription ?? []) {
          receiver(received);
        }
      });
    });

    afterEach(() => {
      sseClient.dispose();
    });

    it("when a message is sent, its echoed back via subscription", async () => {
      const send1 = await client.SendMessage({
        input: { content: "Hello world 1", localId: ulid() },
      });
      const send2 = await client.SendMessage({
        input: { content: "Hello world 2", localId: ulid() },
      });
      const send3 = await client.SendMessage({
        input: { content: "Hello world 3", localId: ulid() },
      });

      await vi.waitFor(() => {
        expect(receiver).toHaveBeenCalledWith(send1.data.sendMessage);
        expect(receiver).toHaveBeenCalledWith(send2.data.sendMessage);
        expect(receiver).toHaveBeenCalledWith(send3.data.sendMessage);
      });
    });
  });
});

function expectEqual<T>(actual: T, expected: T) {
  expect(actual).toEqual(expected);
}
