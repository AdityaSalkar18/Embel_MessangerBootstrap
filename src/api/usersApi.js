const BASE_URL = "http://localhost:8081/api/users";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const request = async (url) => {
  const response = await fetch(url, { method: "GET", headers: authHeaders() });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
};

// GET /api/users/me
export const getMyProfile = async () => {
  const data = await request(`${BASE_URL}/me`);
  return data.data ?? data;
};

// GET /api/users/search?q=
export const searchUsers = async (query = "") => {
  const data = await request(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.users)) return data.users;
  if (Array.isArray(data.content)) return data.content; // Spring Page
  return [];
};

// GET /api/users/{id}
export const getUserProfile = async (id) => {
  const data = await request(`${BASE_URL}/${id}`);
  return data.data ?? data;
};