const BASE_URL = "http://localhost:8081/api/messages";

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
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  const text = await response.text();
  if (!text) return null;
  const data = JSON.parse(text);
  return data?.data ?? data;
};

const toList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content; // Spring Page
  if (Array.isArray(data?.messages)) return data.messages;
  return [];
};

// POST /api/messages
export const sendMessage = (chatId, content) =>
  request(BASE_URL, "POST", { chatId, content });

// POST /api/messages/{messageId}/forward
export const forwardMessage = (messageId, targetChatId) =>
  request(`${BASE_URL}/${messageId}/forward`, "POST", { chatId: targetChatId });

// DELETE /api/messages/{messageId}
export const deleteMessage = (messageId) =>
  request(`${BASE_URL}/${messageId}`, "DELETE");

// PATCH /api/messages/{messageId}
export const editMessage = (messageId, content) =>
  request(`${BASE_URL}/${messageId}`, "PATCH", { content });

// PATCH /api/messages/{messageId}/status
export const updateMessageStatus = (messageId, status) =>
  request(`${BASE_URL}/${messageId}/status`, "PATCH", { status });

// PATCH /api/messages/{messageId}/star
export const toggleStarMessage = (messageId) =>
  request(`${BASE_URL}/${messageId}/star`, "PATCH");

// PATCH /api/messages/{messageId}/react
export const reactToMessage = (messageId, emoji) =>
  request(`${BASE_URL}/${messageId}/react`, "PATCH", { emoji });

// PATCH /api/messages/{messageId}/pin
export const togglePinMessage = (messageId) =>
  request(`${BASE_URL}/${messageId}/pin`, "PATCH");

// GET /api/messages/starred
export const getStarredMessages = async () =>
  toList(await request(`${BASE_URL}/starred`));

// GET /api/messages/chat/{chatId}
export const getChatMessages = async (chatId) =>
  toList(await request(`${BASE_URL}/chat/${chatId}`));

// GET /api/messages/chat/{chatId}/pinned
export const getPinnedMessages = async (chatId) =>
  toList(await request(`${BASE_URL}/chat/${chatId}/pinned`));