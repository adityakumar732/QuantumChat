import { useMemo, useState } from "react";
import { Search, Plus, SlidersHorizontal, MessageCircle, Users, Inbox, Settings, Hash, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setActiveConversation } from "../features/chat/chatSlice";
import { members } from "../data/mockData";
import type { ConversationFilter } from "../types/chat";
import Avatar from "./Avatar";

const filters: { id: ConversationFilter; label: string }[] = [
  { id: "all", label: "All chats" }, { id: "unread", label: "Unread" }, { id: "groups", label: "Groups" }
];

function timeLabel(value: string) {
  const date = new Date(value);
  const now = new Date();
  return date.toDateString() === now.toDateString()
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const { conversations, activeConversationId } = useAppSelector((state) => state.chat);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ConversationFilter>("all");

  const visible = useMemo(() => conversations.filter((conversation) => {
    const matchesSearch = conversation.title.toLowerCase().includes(search.toLowerCase()) || conversation.lastMessage.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "unread" ? conversation.unreadCount > 0 : conversation.type === "group");
    return matchesSearch && matchesFilter;
  }).sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))), [conversations, search, filter]);

  return (
    <>
      {mobileOpen && <button className="mobile-backdrop" aria-label="Close menu" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">Q</div>
          <div><strong>quantum<span>chat</span></strong><small>Workspace</small></div>
          <button className="icon-button sidebar-close" onClick={onClose} aria-label="Close sidebar"><X size={18} /></button>
        </div>

        <div className="workspace-switch">
          <div className="workspace-avatar">Q</div>
          <div className="workspace-copy"><strong>Quantum Studio</strong><small>Free workspace</small></div>
          <span className="workspace-chevron">⌄</span>
        </div>

        <div className="sidebar-nav">
          <button className="nav-item active"><MessageCircle size={17} /> Messages <span>⌘ 1</span></button>
          <button className="nav-item"><Users size={17} /> People</button>
          <button className="nav-item"><Inbox size={17} /> Saved items</button>
        </div>

        <div className="conversation-heading">
          <div><span className="eyebrow">YOUR SPACE</span><h3>Messages</h3></div>
          <button className="new-chat-button" title="New message"><Plus size={17} /></button>
        </div>

        <div className="search-wrap"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations..." aria-label="Search conversations" /><SlidersHorizontal size={15} /></div>

        <div className="filter-tabs" role="tablist" aria-label="Conversation filters">
          {filters.map((item) => <button key={item.id} role="tab" aria-selected={filter === item.id} className={filter === item.id ? "selected" : ""} onClick={() => setFilter(item.id)}>{item.label}</button>)}
        </div>

        <div className="conversation-list">
          {visible.map((conversation) => {
            const person = members.find((member) => member.id === conversation.members.find((id) => id !== "me")) ?? members[0];
            const isActive = activeConversationId === conversation.id;
            return (
              <button key={conversation.id} className={`conversation-item ${isActive ? "conversation-active" : ""}`} onClick={() => { dispatch(setActiveConversation(conversation.id)); onClose(); }}>
                <span className="conversation-avatar-wrap"><Avatar person={conversation.type === "direct" ? person : { id: conversation.id, name: conversation.title, avatar: conversation.avatar, online: false }} size="lg" showStatus={conversation.type === "direct"} />{conversation.type === "group" && <span className="group-mini"><Users size={10} /></span>}</span>
                <span className="conversation-copy"><span className="conversation-top"><strong>{conversation.title}</strong><time>{timeLabel(conversation.lastMessageAt)}</time></span><span className="conversation-bottom"><span>{conversation.lastMessage}</span>{conversation.unreadCount > 0 && <b>{conversation.unreadCount}</b>}</span></span>
              </button>
            );
          })}
          {visible.length === 0 && <div className="empty-search"><Search size={20} /><p>No conversations found</p><small>Try another name or filter.</small></div>}
        </div>

        <div className="sidebar-footer"><Avatar person={members[0]} size="md" showStatus /><div><strong>Aditya Kumar</strong><small>Available</small></div><button className="icon-button" aria-label="Settings"><Settings size={17} /></button></div>
      </aside>
    </>
  );
}