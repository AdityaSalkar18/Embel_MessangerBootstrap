const BASE_URL = "http://localhost:8081/api/notifications";

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

const toList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.notifications)) return data.notifications;
  return [];
};

// GET /api/notifications
export const getMyNotifications = async () => toList(await request(BASE_URL));

// GET /api/notifications/unread-count  (handles 5, { count: 5 } or { unreadCount: 5 })
export const getUnreadCount = async () => {
  const d = await request(`${BASE_URL}/unread-count`);
  if (typeof d === "number") return d;
  return Number(d?.count ?? d?.unreadCount ?? d) || 0;
};

// PATCH /api/notifications/{notificationId}/read
export const markAsRead = (notificationId) =>
  request(`${BASE_URL}/${notificationId}/read`, { method: "PATCH" });

// PATCH /api/notifications/read-all
export const markAllAsRead = () =>
  request(`${BASE_URL}/read-all`, { method: "PATCH" });

// mark all unread notifications of one chat/group as read
export const markChatNotificationsRead = async (chatId) => {
  const list = await getMyNotifications();
  await Promise.all(
    list
      .filter((n) => String(n.chatId) === String(chatId) && !(n.read ?? n.isRead))
      .map((n) => markAsRead(n.id))
  );
};