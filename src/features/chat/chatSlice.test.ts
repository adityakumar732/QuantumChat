import { describe, expect, it } from "vitest";
import reducer, { sendMessage, editMessage, deleteMessage, addReaction } from "./chatSlice";

describe("chat reducer", () => {
  it("adds a message to the selected conversation", () => {
    const state = reducer(undefined, sendMessage("Hello team", "c1"));
    expect(state.messages.some((message) => message.text === "Hello team" && message.conversationId === "c1")).toBe(true);
  });

  it("edits a message sent by the current user", () => {
    const initial = reducer(undefined, sendMessage("Original", "c1"));
    const created = initial.messages[initial.messages.length - 1];
    const updated = reducer(initial, editMessage({ id: created.id, text: "Updated" }));
    expect(updated.messages.find((message) => message.id === created.id)?.text).toBe("Updated");
  });

  it("deletes a message", () => {
    const initial = reducer(undefined, sendMessage("Remove me", "c1"));
    const created = initial.messages[initial.messages.length - 1];
    const updated = reducer(initial, deleteMessage(created.id));
    expect(updated.messages.some((message) => message.id === created.id)).toBe(false);
  });

  it("adds a reaction to a message", () => {
    const initial = reducer(undefined, sendMessage("React to me", "c1"));
    const created = initial.messages[initial.messages.length - 1];
    const updated = reducer(initial, addReaction({ messageId: created.id, emoji: "👍" }));
    expect(updated.messages.find((message) => message.id === created.id)?.reactions[0]?.emoji).toBe("👍");
  });
});