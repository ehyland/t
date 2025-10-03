import Emittery from "emittery";
import type { MessageRecord } from "~/server/db/schema";

export function createPubSub() {
  return new Emittery<{
    messages: { localId: string; record: MessageRecord }[];
  }>();
}
