import { eq } from "drizzle-orm";
import { describe, expect, it, beforeEach } from "vitest";
import { db, t } from "../db";
import { saveMessage } from "./saveMessage";
import { installDB } from "../../test/utils/db";

installDB();

describe("saveMessage", () => {
  it("should save a message with sequence 1 for a new channel", async () => {
    const result = await saveMessage({
      channel: "test-channel",
      content: "Hello World",
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.channel).toBe("test-channel");
    expect(result.content).toBe("Hello World");
    expect(result.sequence).toBe(1);

    // Check DB state
    const messages = await db
      .select()
      .from(t.message)
      .where(eq(t.message.channel, "test-channel"));
    expect(messages).toHaveLength(1);
    expect(messages[0].sequence).toBe(1);

    const sequences = await db
      .select()
      .from(t.channelSequence)
      .where(eq(t.channelSequence.channel, "test-channel"));
    expect(sequences).toHaveLength(1);
    expect(sequences[0].nextSequence).toBe(1); // not incremented for first insert
  });

  it("should increment sequence for subsequent messages in the same channel", async () => {
    await saveMessage({
      channel: "test-channel",
      content: "First message",
    });

    const result2 = await saveMessage({
      channel: "test-channel",
      content: "Second message",
    });

    expect(result2.sequence).toBe(2);

    const messages = await db
      .select()
      .from(t.message)
      .where(eq(t.message.channel, "test-channel"))
      .orderBy(t.message.sequence);
    expect(messages).toHaveLength(2);
    expect(messages[0].sequence).toBe(1);
    expect(messages[1].sequence).toBe(2);

    const sequences = await db
      .select()
      .from(t.channelSequence)
      .where(eq(t.channelSequence.channel, "test-channel"));
    expect(sequences[0].nextSequence).toBe(2);
  });

  it("should maintain separate sequences for different channels", async () => {
    await saveMessage({
      channel: "channel1",
      content: "Message 1",
    });

    await saveMessage({
      channel: "channel2",
      content: "Message 2",
    });

    const result3 = await saveMessage({
      channel: "channel1",
      content: "Message 3",
    });

    expect(result3.sequence).toBe(2);

    const messages1 = await db
      .select()
      .from(t.message)
      .where(eq(t.message.channel, "channel1"));
    expect(messages1).toHaveLength(2);

    const messages2 = await db
      .select()
      .from(t.message)
      .where(eq(t.message.channel, "channel2"));
    expect(messages2).toHaveLength(1);
    expect(messages2[0].sequence).toBe(1);
  });
});
