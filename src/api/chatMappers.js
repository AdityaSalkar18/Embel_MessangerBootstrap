const COLORS = ["#7C6FE8", "#2E9E6D", "#D9822B", "#E8556D", "#2B8FD9"];

const initials = (name) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const fmtListTime = (ts) => {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const y = new Date();
  y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { day: "2-digit", month: "short" });
};

export const toList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.chats)) return data.chats;
  return [];
};

// Maps a backend chat to what the list screens use
export const mapChat = (c) => {
  const isGroup =
    c.group ?? c.isGroup ?? String(c.type || "").toUpperCase() === "GROUP";
  const other = c.otherUser ?? c.user ?? c.targetUser ?? c.participant;
  const name =
    c.name ?? c.title ?? other?.name ?? other?.fullName ?? other?.username ?? "Unknown";
  const last = c.lastMessage;
  const message = typeof last === "string" ? last : last?.content ?? last?.text ?? "";
  const ts =
    new Date(c.lastMessageAt ?? last?.createdAt ?? c.updatedAt ?? 0).getTime() || 0;
  const type = isGroup ? "group" : "chat";
  const id = c.id ?? c.chatId;

  return {
    key: `${type}-${id}`,
    type,
    id, // chatId
    userId: other?.id ?? other?.userId ?? c.targetUserId,
    name,
    avatar: c.avatar || initials(name),
    color: c.color || COLORS[name.charCodeAt(0) % COLORS.length],
    message,
    ts,
    time: fmtListTime(ts),
    unread: c.unreadCount ?? c.unread ?? 0,
    online: other?.online ?? other?.isOnline ?? c.online ?? false,
    pinned: c.pinned ?? c.isPinned ?? false,
    archived: c.archived ?? c.isArchived ?? false,
    memberCount: c.memberCount ?? c.members?.length ?? 0,
    isAdmin: c.isAdmin ?? false,
    description: c.description ?? "",
  };
};