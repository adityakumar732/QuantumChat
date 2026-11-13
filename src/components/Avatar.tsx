import type { Member } from "../types/chat";

const colors = ["avatar-violet", "avatar-blue", "avatar-pink", "avatar-green", "avatar-orange"];

export default function Avatar({ person, size = "md", showStatus = false }: { person: Pick<Member, "id" | "name" | "avatar" | "online">; size?: "sm" | "md" | "lg"; showStatus?: boolean }) {
  const color = colors[Math.abs(person.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % colors.length];
  return (
    <span className={`avatar ${color} avatar-${size}`}>
      {person.avatar}
      {showStatus && <i className={`status-dot ${person.online ? "online" : "offline"}`} />}
    </span>
  );
}