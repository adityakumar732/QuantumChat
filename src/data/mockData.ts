import type { ChatMessage, Conversation, Member } from "../types/chat";

export const currentUserId = "me";

export const members: Member[] = [
  { id: "me", name: "Aditya Kumar", avatar: "AK", online: true, role: "You" },
  { id: "sarah", name: "Sarah Chen", avatar: "SC", online: true, role: "Product Designer" },
  { id: "marcus", name: "Marcus Lee", avatar: "ML", online: true, role: "Frontend Engineer" },
  { id: "priya", name: "Priya Sharma", avatar: "PS", online: false, role: "Project Manager" },
  { id: "daniel", name: "Daniel Kim", avatar: "DK", online: true, role: "Backend Engineer" },
  { id: "olivia", name: "Olivia Wilson", avatar: "OW", online: false, role: "QA Engineer" },
  { id: "james", name: "James Brown", avatar: "JB", online: true, role: "Developer" }
];

const today = new Date();
const ago = (minutes: number) => new Date(today.getTime() - minutes * 60000).toISOString();

export const initialConversations: Conversation[] = [
  { id: "c1", type: "direct", title: "Sarah Chen", avatar: "SC", members: ["me", "sarah"], lastMessage: "The new dashboard looks amazing!", lastMessageAt: ago(2), unreadCount: 2, pinned: true },
  { id: "c2", type: "group", title: "Product Team", avatar: "PT", members: ["me", "sarah", "marcus", "priya"], lastMessage: "Priya: Let's sync tomorrow.", lastMessageAt: ago(18), unreadCount: 4, pinned: true },
  { id: "c3", type: "direct", title: "Marcus Lee", avatar: "ML", members: ["me", "marcus"], lastMessage: "I pushed the latest changes.", lastMessageAt: ago(65), unreadCount: 0 },
  { id: "c4", type: "group", title: "Engineering", avatar: "EN", members: ["me", "marcus", "daniel", "james"], lastMessage: "Daniel: API is ready for review.", lastMessageAt: ago(180), unreadCount: 0 },
  { id: "c5", type: "direct", title: "Priya Sharma", avatar: "PS", members: ["me", "priya"], lastMessage: "Thanks for the update!", lastMessageAt: ago(1440), unreadCount: 0 },
  { id: "c6", type: "direct", title: "Olivia Wilson", avatar: "OW", members: ["me", "olivia"], lastMessage: "Can you check the mobile layout?", lastMessageAt: ago(2880), unreadCount: 0 }
];

export const initialMessages: ChatMessage[] = [
  { id: "m1", conversationId: "c1", senderId: "sarah", text: "Hey Aditya! Have you had a chance to look at the latest dashboard designs?", createdAt: ago(35), status: "read", reactions: [{ emoji: "👀", userIds: ["me"] }] },
  { id: "m2", conversationId: "c1", senderId: "me", text: "Hey Sarah! Yes, I went through them this morning. The new direction looks really clean.", createdAt: ago(30), status: "read", reactions: [] },
  { id: "m3", conversationId: "c1", senderId: "sarah", text: "Amazing! I focused on making the navigation simpler and giving the content more breathing room.", createdAt: ago(27), status: "read", reactions: [] },
  { id: "m4", conversationId: "c1", senderId: "me", text: "I love the updated sidebar. I'll start implementing the components today.", createdAt: ago(20), status: "read", reactions: [{ emoji: "🔥", userIds: ["sarah"] }] },
  { id: "m5", conversationId: "c1", senderId: "sarah", text: "The new dashboard looks amazing!", createdAt: ago(2), status: "read", reactions: [] },
  { id: "m6", conversationId: "c2", senderId: "priya", text: "Hi team! Sharing the agenda for tomorrow's product sync.", createdAt: ago(70), status: "read", reactions: [] },
  { id: "m7", conversationId: "c2", senderId: "marcus", text: "Thanks Priya, I'll bring the latest build.", createdAt: ago(45), status: "delivered", reactions: [{ emoji: "👍", userIds: ["me", "sarah"] }] },
  { id: "m8", conversationId: "c2", senderId: "priya", text: "Let's sync tomorrow.", createdAt: ago(18), status: "delivered", reactions: [] },
  { id: "m9", conversationId: "c3", senderId: "marcus", text: "I pushed the latest changes. The responsive navigation is ready for review.", createdAt: ago(65), status: "delivered", reactions: [] },
  { id: "m10", conversationId: "c4", senderId: "daniel", text: "API is ready for review. I've added the pagination endpoint too.", createdAt: ago(180), status: "delivered", reactions: [] },
  { id: "m11", conversationId: "c5", senderId: "priya", text: "Thanks for the update! This looks good to me.", createdAt: ago(1440), status: "read", reactions: [] },
  { id: "m12", conversationId: "c6", senderId: "olivia", text: "Can you check the mobile layout? I noticed a small spacing issue.", createdAt: ago(2880), status: "delivered", reactions: [] }
];