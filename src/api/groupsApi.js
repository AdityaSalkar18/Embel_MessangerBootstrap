const BASE_URL = "http://localhost:8081/api/groups";

const COLORS = ["#7C6FE8", "#2E9E6D", "#D9822B", "#E8556D", "#2B8FD9"];

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const request = async (url, method = "GET", body) => {
  const response = await fetch(url, {
    method,
    headers: authHeaders(),
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  if (!response.ok) {
    const text = await response.text();
    console.error(`${method} ${url} failed`, response.status, text);
    throw new Error(`Request failed: ${response.status} ${text}`);
  }
  const text = await response.text();
  if (!text) return null;
  const data = JSON.parse(text);
  return data?.data ?? data;
};

const toList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.groups)) return data.groups;
  if (Array.isArray(data?.members)) return data.members;
  return [];
};

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

export const mapGroup = (g) => {
  const name = g.name ?? g.title ?? "Group";
  const last = g.lastMessage;
  const message = typeof last === "string" ? last : last?.content ?? last?.text ?? "";
  const ts = new Date(g.lastMessageAt ?? last?.createdAt ?? g.updatedAt ?? 0).getTime() || 0;
  const id = g.id ?? g.groupId;

  return {
    key: `group-${id}`,
    type: "group",
    id, // groupId
    chatId: g.chatId ?? id, // used by the Messages API
    name,
    description: g.description ?? "",
    avatar: initials(name),
    color: g.color || COLORS[name.charCodeAt(0) % COLORS.length],
    message,
    ts,
    time: fmtListTime(ts),
    unread: g.unreadCount ?? g.unread ?? 0,
    memberCount: g.memberCount ?? g.members?.length ?? 0,
    isAdmin: g.isAdmin ?? g.admin ?? String(g.role || "").toUpperCase() === "ADMIN",
  };
};

// GET /api/groups
export const getMyGroups = async () => toList(await request(BASE_URL)).map(mapGroup);

// POST /api/groups
export const createGroup = async ({ name, description = "", memberIds }) =>
  mapGroup(
    await request(BASE_URL, "POST", {
      name,
      description,
      memberUserIds: memberIds,
    })
  );

// GET /api/groups/{groupId}
export const getGroup = async (groupId) => mapGroup(await request(`${BASE_URL}/${groupId}`));

// PUT /api/groups/{groupId}
export const updateGroup = (groupId, { name, description, avatar }) =>
  request(`${BASE_URL}/${groupId}`, "PUT", { name, description, avatar });

// DELETE /api/groups/{groupId}
export const deleteGroup = (groupId) => request(`${BASE_URL}/${groupId}`, "DELETE");

// GET /api/groups/{groupId}/members
export const getGroupMembers = async (groupId) =>
  toList(await request(`${BASE_URL}/${groupId}/members`));

// POST /api/groups/{groupId}/members
export const addGroupMember = (groupId, userId) =>
  request(`${BASE_URL}/${groupId}/members`, "POST", { userId });

// DELETE /api/groups/{groupId}/members/{targetUserId}
export const removeGroupMember = (groupId, userId) =>
  request(`${BASE_URL}/${groupId}/members/${userId}`, "DELETE");

// PUT /api/groups/{groupId}/members/{targetUserId}/promote
export const promoteMember = (groupId, userId) =>
  request(`${BASE_URL}/${groupId}/members/${userId}/promote`, "PUT");

// PUT /api/groups/{groupId}/members/{targetUserId}/demote
export const demoteMember = (groupId, userId) =>
  request(`${BASE_URL}/${groupId}/members/${userId}/demote`, "PUT");

// PATCH /api/groups/{groupId}/members/{targetUserId}/block
export const blockMember = (groupId, userId) =>
  request(`${BASE_URL}/${groupId}/members/${userId}/block`, "PATCH");

// PATCH /api/groups/{groupId}/members/{targetUserId}/unblock
export const unblockMember = (groupId, userId) =>
  request(`${BASE_URL}/${groupId}/members/${userId}/unblock`, "PATCH");

// POST /api/groups/{groupId}/leave
export const leaveGroup = (groupId) => request(`${BASE_URL}/${groupId}/leave`, "POST");

// DELETE /api/groups/{groupId}/messages  (PERMANENT)
export const clearGroupMessages = (groupId) => request(`${BASE_URL}/${groupId}/messages`, "DELETE");