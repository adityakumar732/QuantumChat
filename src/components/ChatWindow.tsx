import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Phone, Video, MoreVertical, Paperclip, Smile, Send, Search, Info, X, CornerUpLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { sendMessage, setTyping, toggleGroupInfo, simulateIncoming } from "../features/chat/chatSlice";
import { currentUserId, members } from "../data/mockData";
import { getIncomingMessage } from "../services/mockChatApi";
import type { ChatMessage } from "../types/chat";
import Avatar from "./Avatar";
import MessageBubble from "./MessageBubble";

function dayLabel(value: string) {
  const date = new Date(value);
  if (date.toDateString() === new Date().toDateString()) return "Today";
  return date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}

export default function ChatWindow({ onMenu }: { onMenu: () => void }) {
  const dispatch = useAppDispatch();
  const { conversations, messages, activeConversationId, typingConversationId, groupInfoOpen } = useAppSelector((state) => state.chat);
  const conversation = conversations.find((item) => item.id === activeConversationId)!;
  const conversationMessages = useMemo(() => messages.filter((message) => message.conversationId === activeConversationId), [messages, activeConversationId]);
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [messageSearch, setMessageSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isGroup = conversation.type === "group";
  const firstMember = members.find((member) => member.id === conversation.members.find((id) => id !== currentUserId)) ?? members[0];
  const typingPerson = members.find((member) => member.id !== currentUserId && member.online);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [conversationMessages.length, activeConversationId, typingConversationId]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (Math.random() > 0.72) {
        const sender = conversation.members.find((id) => id !== currentUserId);
        if (sender) {
          dispatch(setTyping(activeConversationId));
          window.setTimeout(() => {
            dispatch(simulateIncoming({ conversationId: activeConversationId, senderId: sender, text: getIncomingMessage() }));
            dispatch(setTyping(null));
          }, 1800);
        }
      }
    }, 16000);
    return () => window.clearInterval(timer);
  }, [activeConversationId, conversation.members, dispatch]);

  const submit = () => {
    if (!draft.trim()) return;
    dispatch(sendMessage(draft.trim(), activeConversationId, replyTo?.id));
    setDraft("");
    setReplyTo(null);
    dispatch(setTyping(null));
  };

  const grouped = conversationMessages.reduce<{ label: string; items: ChatMessage[] }[]>((groups, message) => {
    const label = dayLabel(message.createdAt);
    const last = groups[groups.length - 1];
    if (!last || last.label !== label) groups.push({ label, items: [message] });
    else last.items.push(message);
    return groups;
  }, []);

  const filteredGroups = messageSearch.trim() ? grouped.map((group) => ({ ...group, items: group.items.filter((message) => message.text.toLowerCase().includes(messageSearch.toLowerCase())) })).filter((group) => group.items.length) : grouped;

  return (
    <main className="chat-main">
      <header className="chat-header">
        <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open conversations"><ArrowLeft size={19} /></button>
        <Avatar person={isGroup ? { id: conversation.id, name: conversation.title, avatar: conversation.avatar, online: false } : firstMember} size="lg" showStatus={!isGroup} />
        <div className="chat-heading"><strong>{conversation.title}</strong><span>{isGroup ? `${conversation.members.length} members · ${conversation.members.filter((id) => members.find((member) => member.id === id)?.online).length} online` : firstMember.online ? "Active now" : "Last seen recently"}</span></div>
        <div className="chat-header-actions">
          <button className="icon-button" aria-label="Search messages" onClick={() => setSearchOpen((value) => !value)}><Search size={18} /></button>
          <button className="icon-button hide-mobile" aria-label="Start audio call"><Phone size={18} /></button>
          <button className="icon-button hide-mobile" aria-label="Start video call"><Video size={19} /></button>
          <button className="icon-button" aria-label="Conversation information" onClick={() => dispatch(toggleGroupInfo())}><Info size={18} /></button>
          <button className="icon-button" aria-label="More options"><MoreVertical size={18} /></button>
        </div>
      </header>

      {searchOpen && <div className="message-search"><Search size={15} /><input autoFocus placeholder="Search in this conversation..." value={messageSearch} onChange={(event) => setMessageSearch(event.target.value)} /><button onClick={() => { setSearchOpen(false); setMessageSearch(""); }}><X size={15} /></button></div>}

      <div className="chat-body">
        <div className="messages-scroll" ref={scrollRef}>
          <div className="conversation-intro"><div className="intro-avatar"><Avatar person={isGroup ? { id: conversation.id, name: conversation.title, avatar: conversation.avatar, online: false } : firstMember} size="lg" /></div><h2>{conversation.title}</h2><p>{isGroup ? "This is the beginning of your group conversation." : `This is the beginning of your conversation with ${firstMember.name}.`}</p><span className="intro-date">TODAY</span></div>
          {filteredGroups.map((group) => <section className="message-day" key={group.label}><div className="date-divider"><span>{group.label}</span></div>{group.items.map((message) => <MessageBubble key={message.id} message={message} onReply={setReplyTo} />)}</section>)}
          {filteredGroups.length === 0 && <div className="empty-messages">No messages match “{messageSearch}”.</div>}
          {typingConversationId === activeConversationId && <div className="typing-indicator"><Avatar person={typingPerson ?? firstMember} size="sm" /><span>{typingPerson?.name ?? "Someone"} is typing</span><i /><i /><i /></div>}
        </div>
      </div>

      <div className="composer-area">
        {replyTo && <div className="replying-to"><CornerUpLeft size={14} /><span>Replying to: <strong>{replyTo.text}</strong></span><button onClick={() => setReplyTo(null)} aria-label="Cancel reply"><X size={15} /></button></div>}
        {showEmoji && <div className="composer-emoji">{["😀", "😂", "😍", "👍", "🎉", "🔥", "❤️", "🙏"].map((emoji) => <button key={emoji} onClick={() => { setDraft((value) => value + emoji); setShowEmoji(false); }}>{emoji}</button>)}</div>}
        <div className="composer">
          <button className="icon-button composer-tool" title="Attach file" onClick={() => alert("Attachment preview is a demo feature.")}><Paperclip size={19} /></button>
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(); } }} placeholder={`Message ${isGroup ? conversation.title : firstMember.name}...`} rows={1} aria-label="Message input" />
          <button className="icon-button composer-tool" title="Add emoji" onClick={() => setShowEmoji((value) => !value)}><Smile size={19} /></button>
          <button className="send-button" onClick={submit} disabled={!draft.trim()} aria-label="Send message"><Send size={17} /></button>
        </div>
        <div className="composer-hint"><span><kbd>↵</kbd> to send <span className="hint-dot">·</span> <kbd>Shift + ↵</kbd> for new line</span><span>Messages are private to this workspace</span></div>
      </div>
    </main>
  );
}