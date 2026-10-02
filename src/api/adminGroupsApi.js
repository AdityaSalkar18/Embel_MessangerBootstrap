const BASE_URL = "http://localhost:8081/api/admin/groups";

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

export const getAllGroups = () => request(BASE_URL);

export const updateGroup = (groupId, body) =>
  request(`${BASE_URL}/${groupId}`, { method: "PUT", body });
export const deleteGroup = (groupId) =>
  request(`${BASE_URL}/${groupId}`, { method: "DELETE" });

export const banGroup = (groupId) =>
  request(`${BASE_URL}/${groupId}/ban`, { method: "PATCH" });
export const unbanGroup = (groupId) =>
  request(`${BASE_URL}/${groupId}/unban`, { method: "PATCH" });

export const clearGroupMessages = (groupId) =>
  request(`${BASE_URL}/${groupId}/messages`, { method: "DELETE" });
export const clearMultipleGroupMessages = (groupIds) =>
  request(`${BASE_URL}/clear-messages`, { method: "POST", body: { groupIds } });

export const addGroupMember = (groupId, userId) =>
  request(`${BASE_URL}/${groupId}/members`, { method: "POST", body: { userId } });
export const removeGroupMember = (groupId, userId) =>
  request(`${BASE_URL}/${groupId}/members/${userId}`, { method: "DELETE" });
export const promoteMember = (groupId, userId) =>
  request(`${BASE_URL}/${groupId}/members/${userId}/promote`, { method: "PUT" });
export const demoteMember = (groupId, userId) =>
  request(`${BASE_URL}/${groupId}/members/${userId}/demote`, { method: "PUT" });
export const blockMember = (groupId, userId) =>
  request(`${BASE_URL}/${groupId}/members/${userId}/block`, { method: "PATCH" });
export const unblockMember = (groupId, userId) =>
  request(`${BASE_URL}/${groupId}/members/${userId}/unblock`, { method: "PATCH" });