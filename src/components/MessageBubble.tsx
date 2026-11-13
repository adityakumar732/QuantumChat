import { useState } from "react";
import { Copy, CornerUpLeft, MoreHorizontal, Pencil, Smile, Trash2, Check, CheckCheck } from "lucide-react";
import type { ChatMessage } from "../types/chat";
import { members, currentUserId } from "../data/mockData";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addReaction, deleteMessage, editMessage } from "../features/chat/chatSlice";
import Avatar from "./Avatar";

const emojiChoices = ["👍", "❤️", "😂", "🎉", "🔥"];

export default function MessageBubble({ message, onReply }: { message: ChatMessage; onReply: (message: ChatMessage) => void }) {
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const mine = message.senderId === currentUserId;
  const person = members.find((member) => member.id === message.senderId) ?? members[0];
  const reply = useAppSelector((state) => state.chat.messages.find((item) => item.id === message.replyTo));

  const saveEdit = () => {
    if (editText.trim()) dispatch(editMessage({ id: message.id, text: editText.trim() }));
    setEditing(false);
  };

  return (
    <div className={`message-row ${mine ? "message-mine" : ""}`}>
      {!mine && <Avatar person={person} size="sm" />}
      <div className="message-content">
        {!mine && <div className="message-sender">{person.name}</div>}
        {reply && <div className="reply-preview"><CornerUpLeft size={12} /><span>{reply.text}</span></div>}
        <div className={`message-bubble ${mine ? "bubble-mine" : "bubble-theirs"}`}>
          {editing ? <div className="edit-form"><textarea value={editText} onChange={(event) => setEditText(event.target.value)} autoFocus /><div><button onClick={() => setEditing(false)}>Cancel</button><button className="save-edit" onClick={saveEdit}><Check size={13} /> Save</button></div></div> : <p>{message.text}</p>}
          <div className="message-meta"><span>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{message.edited && " · edited"}</span>{mine && (message.status === "read" ? <CheckCheck size={14} className="read-check" /> : <Check size={14} />)}</div>
        </div>
        {!editing && <div className="message-actions">
          <button title="React" onClick={() => setMenuOpen((value) => !value)}><Smile size={14} /></button>
          <button title="Reply" onClick={() => onReply(message)}><CornerUpLeft size={14} /></button>
          <button title="More actions" onClick={() => setMenuOpen((value) => !value)}><MoreHorizontal size={15} /></button>
          {menuOpen && <div className="message-menu">
            <div className="emoji-row">{emojiChoices.map((emoji) => <button key={emoji} onClick={() => { dispatch(addReaction({ messageId: message.id, emoji })); setMenuOpen(false); }}>{emoji}</button>)}</div>
            <button onClick={() => { void navigator.clipboard?.writeText(message.text); setMenuOpen(false); }}><Copy size={13} /> Copy message</button>
            <button onClick={() => { onReply(message); setMenuOpen(false); }}><CornerUpLeft size={13} /> Reply</button>
            {mine && <button onClick={() => { setEditing(true); setMenuOpen(false); }}><Pencil size={13} /> Edit message</button>}
            {mine && <button className="danger-action" onClick={() => { dispatch(deleteMessage(message.id)); setMenuOpen(false); }}><Trash2 size={13} /> Delete message</button>}
          </div>}
        </div>}
        {message.reactions.length > 0 && <div className="reactions">{message.reactions.map((reaction) => <button key={reaction.emoji} onClick={() => dispatch(addReaction({ messageId: message.id, emoji: reaction.emoji }))}>{reaction.emoji} <span>{reaction.userIds.length}</span></button>)}</div>}
      </div>
    </div>
  );
}