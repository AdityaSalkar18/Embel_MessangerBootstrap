const BASE_URL = "http://localhost:8081/api/admin/chats";

const request = async (url, { method = "GET", body } = {}) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    method,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(body !== undefined && { "Content-Type": "application/json" }),
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  if (!response.ok) {
    const text = await response.text();
    console.error(`${method} ${url} failed`, response.status, text);
    throw new Error(`Request failed: ${response.status} ${text}`);
  }
  const text = await response.text();
  if (!text) return null;
  try {
    const data = JSON.parse(text);
    return data?.data ?? data;
  } catch {
    return text;
  }
};

// DELETE /api/admin/chats/{chatId}/messages  (any chat type, PERMANENT)
export const clearChatMessages = (chatId) =>
  request(`${BASE_URL}/${chatId}/messages`, { method: "DELETE" });

// DELETE /api/admin/chats/clear-messages  (bulk, any mix of types, PERMANENT)
export const clearChatMessagesBulk = (chatIds) =>
  request(`${BASE_URL}/clear-messages`, { method: "DELETE", body: { chatIds } });