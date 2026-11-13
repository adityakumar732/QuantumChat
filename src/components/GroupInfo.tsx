import { useState } from "react";
import { X, Plus, MoreHorizontal, Users, Bell, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addGroupMember, removeGroupMember } from "../features/chat/chatSlice";
import { members, currentUserId } from "../data/mockData";
import Avatar from "./Avatar";

export default function GroupInfo() {
  const dispatch = useAppDispatch();
  const { conversations, activeConversationId, groupInfoOpen } = useAppSelector((state) => state.chat);
  const conversation = conversations.find((item) => item.id === activeConversationId)!;
  const [addOpen, setAddOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  if (!groupInfoOpen) return null;
  const activeMembers = conversation.members.map((id) => members.find((member) => member.id === id)).filter((member): member is NonNullable<typeof member> => Boolean(member));
  const available = members.filter((member) => !conversation.members.includes(member.id) && member.id !== currentUserId && member.name.toLowerCase().includes(memberSearch.toLowerCase()));

  return (
    <aside className="group-info">
      <div className="info-header"><strong>Conversation details</strong><button className="icon-button" onClick={() => dispatch({ type: "chat/toggleGroupInfo" })} aria-label="Close details"><X size={18} /></button></div>
      <div className="group-profile"><div className="group-large-avatar">{conversation.avatar}</div><h3>{conversation.title}</h3><p>{conversation.type === "group" ? "Group conversation" : "Direct message"}</p><div className="group-actions"><button><Bell size={16} /> Mute</button><button><Search size={16} /> Search</button></div></div>
      <div className="info-section"><div className="info-section-title"><div><Users size={16} /><strong>Members</strong><span>{activeMembers.length}</span></div><button className="add-member" onClick={() => setAddOpen((value) => !value)}><Plus size={15} /> Add</button></div>
        {addOpen && <div className="add-member-panel"><input value={memberSearch} onChange={(event) => setMemberSearch(event.target.value)} placeholder="Find a teammate..." />{available.map((member) => <button key={member.id} onClick={() => { dispatch(addGroupMember({ conversationId: conversation.id, memberId: member.id })); setAddOpen(false); setMemberSearch(""); }}><Avatar person={member} size="sm" /><span>{member.name}</span><Plus size={14} /></button>)}{available.length === 0 && <small>No available members</small>}</div>}
        <div className="member-list">{activeMembers.map((member) => <div className="member-row" key={member.id}><Avatar person={member} size="md" showStatus /><div><strong>{member.name}</strong><small>{member.id === currentUserId ? "You · Admin" : member.role}</small></div>{member.id !== currentUserId && conversation.type === "group" && <button className="icon-button remove-member" title={`Remove ${member.name}`} onClick={() => dispatch(removeGroupMember({ conversationId: conversation.id, memberId: member.id }))}><MoreHorizontal size={17} /></button>}</div>)}</div>
      </div>
      <div className="info-section shared-files"><div className="info-section-title"><div><strong>Shared files</strong><span>0</span></div></div><div className="shared-empty">No files shared yet</div></div>
      <div className="info-footer">QuantumChat · Workspace conversation</div>
    </aside>
  );
}