import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatMessage, Conversation } from "../../types/chat";
import { initialConversations, initialMessages, currentUserId } from "../../data/mockData";

interface ChatState {
  conversations: Conversation[];
  messages: ChatMessage[];
  activeConversationId: string;
  typingConversationId: string | null;
  status: "ready" | "loading" | "error";
  theme: "light" | "dark";
  groupInfoOpen: boolean;
}

const savedTheme = typeof localStorage !== "undefined" ? localStorage.getItem("quantumchat-theme") : null;

const initialState: ChatState = {
  conversations: initialConversations,
  messages: initialMessages,
  activeConversationId: "c1",
  typingConversationId: null,
  status: "ready",
  theme: savedTheme === "dark" ? "dark" : "light",
  groupInfoOpen: true
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation(state, action: PayloadAction<string>) {
      state.activeConversationId = action.payload;
      const conversation = state.conversations.find((item) => item.id === action.payload);
      if (conversation) conversation.unreadCount = 0;
    },
    sendMessage: {
      reducer(state, action: PayloadAction<ChatMessage>) {
        state.messages.push(action.payload);
        const conversation = state.conversations.find((item) => item.id === action.payload.conversationId);
        if (conversation) {
          conversation.lastMessage = action.payload.text;
          conversation.lastMessageAt = action.payload.createdAt;
          conversation.unreadCount = 0;
        }
      },
      prepare(text: string, conversationId: string, replyTo?: string) {
        return { payload: { id: nanoid(), conversationId, senderId: currentUserId, text, createdAt: new Date().toISOString(), status: "sent" as const, replyTo, reactions: [] } };
      }
    },
    editMessage(state, action: PayloadAction<{ id: string; text: string }>) {
      const message = state.messages.find((item) => item.id === action.payload.id);
      if (message && message.senderId === currentUserId) {
        message.text = action.payload.text;
        message.edited = true;
      }
    },
    deleteMessage(state, action: PayloadAction<string>) {
      state.messages = state.messages.filter((item) => item.id !== action.payload);
    },
    addReaction(state, action: PayloadAction<{ messageId: string; emoji: string }>) {
      const message = state.messages.find((item) => item.id === action.payload.messageId);
      if (!message) return;
      const reaction = message.reactions.find((item) => item.emoji === action.payload.emoji);
      if (reaction) {
        if (reaction.userIds.includes(currentUserId)) reaction.userIds = reaction.userIds.filter((id) => id !== currentUserId);
        else reaction.userIds.push(currentUserId);
        if (reaction.userIds.length === 0) message.reactions = message.reactions.filter((item) => item.emoji !== action.payload.emoji);
      } else message.reactions.push({ emoji: action.payload.emoji, userIds: [currentUserId] });
    },
    setTyping(state, action: PayloadAction<string | null>) {
      state.typingConversationId = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("quantumchat-theme", state.theme);
    },
    toggleGroupInfo(state) {
      state.groupInfoOpen = !state.groupInfoOpen;
    },
    addGroupMember(state, action: PayloadAction<{ conversationId: string; memberId: string }>) {
      const conversation = state.conversations.find((item) => item.id === action.payload.conversationId);
      if (conversation && !conversation.members.includes(action.payload.memberId)) conversation.members.push(action.payload.memberId);
    },
    removeGroupMember(state, action: PayloadAction<{ conversationId: string; memberId: string }>) {
      const conversation = state.conversations.find((item) => item.id === action.payload.conversationId);
      if (conversation) conversation.members = conversation.members.filter((id) => id !== action.payload.memberId);
    },
    simulateIncoming(state, action: PayloadAction<{ conversationId: string; text: string; senderId: string }>) {
      const message: ChatMessage = { id: nanoid(), conversationId: action.payload.conversationId, senderId: action.payload.senderId, text: action.payload.text, createdAt: new Date().toISOString(), status: "delivered", reactions: [] };
      state.messages.push(message);
      const conversation = state.conversations.find((item) => item.id === action.payload.conversationId);
      if (conversation) {
        conversation.lastMessage = `${message.text}`;
        conversation.lastMessageAt = message.createdAt;
        if (state.activeConversationId !== conversation.id) conversation.unreadCount += 1;
      }
    }
  }
});

export const { setActiveConversation, sendMessage, editMessage, deleteMessage, addReaction, setTyping, toggleTheme, toggleGroupInfo, addGroupMember, removeGroupMember, simulateIncoming } = chatSlice.actions;
export default chatSlice.reducer;