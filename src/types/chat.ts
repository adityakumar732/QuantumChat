export type MessageStatus = "sent" | "delivered" | "read";
export type ConversationType = "direct" | "group";

export interface Member {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  role?: string;
}

export interface Reaction {
  emoji: string;
  userIds: string[];
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  status: MessageStatus;
  replyTo?: string;
  reactions: Reaction[];
  edited?: boolean;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  title: string;
  avatar: string;
  members: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  pinned?: boolean;
}

export type ConversationFilter = "all" | "unread" | "groups";