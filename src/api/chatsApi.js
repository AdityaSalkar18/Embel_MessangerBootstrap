import { mapChat, toList } from "./chatMappers";

const BASE_URL = "http://localhost:8081/api/chats";

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

// GET /api/chats
export const getMyChats = async () =>
  toList(await request(BASE_URL)).map(mapChat).filter((c) => !c.archived);

// POST /api/chats  (start or reopen 1-to-1)
export const getOrCreateOneToOneChat = (userId) =>
  request(BASE_URL, "POST", { targetUserId: userId });

// GET /api/chats/{chatId}
export const getChat = (chatId) => request(`${BASE_URL}/${chatId}`);

// GET /api/chats/search?q=
export const searchChats = async (q) =>
  toList(await request(`${BASE_URL}/search?q=${encodeURIComponent(q)}`)).map(mapChat);

// PATCH /api/chats/{chatId}/read
export const markChatAsRead = (chatId) => request(`${BASE_URL}/${chatId}/read`, "PATCH");

// PATCH /api/chats/{chatId}/pin
export const togglePinChat = (chatId) => request(`${BASE_URL}/${chatId}/pin`, "PATCH");

// PATCH /api/chats/{chatId}/mute
export const toggleMuteChat = (chatId) => request(`${BASE_URL}/${chatId}/mute`, "PATCH");

// PATCH /api/chats/{chatId}/archive
export const toggleArchiveChat = (chatId) => request(`${BASE_URL}/${chatId}/archive`, "PATCH");

// DELETE /api/chats/{chatId}/messages  (PERMANENT, 1-to-1 only)
export const clearChatMessages = (chatId) => request(`${BASE_URL}/${chatId}/messages`, "DELETE");