import { members } from "../data/mockData";

const incomingMessages = [
  "That sounds great! I'll take a look.",
  "Thanks for sharing this update.",
  "Could we review this in our next sync?",
  "Nice work — this is looking really good."
];

export async function fetchConversations() {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return { count: 6, onlineMembers: members.filter((member) => member.online).length };
}

export function getIncomingMessage() {
  return incomingMessages[Math.floor(Math.random() * incomingMessages.length)];
}