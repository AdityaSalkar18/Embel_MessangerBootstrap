const BASE_URL = "http://localhost:8081/api/attachments";

// NOTE: no "Content-Type" here - the browser must set the multipart boundary itself
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (url, { method = "GET", body } = {}) => {
  const response = await fetch(url, {
    method,
    headers: authHeaders(),
    ...(body !== undefined && { body }),
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
  if (Array.isArray(data?.projects)) return data.projects;
  if (Array.isArray(data?.files)) return data.files;
  return [];
};

// POST /api/attachments/upload  (single file)
export const uploadFile = (file, chatId) => {
  const form = new FormData();
  form.append("file", file);
  if (chatId != null) form.append("chatId", chatId);
  return request(`${BASE_URL}/upload`, { method: "POST", body: form });
};

// POST /api/attachments/upload-multiple  (kept as individual attachments)
export const uploadMultiple = (files, chatId) => {
  const form = new FormData();
  Array.from(files).forEach((f) => form.append("files", f));
  if (chatId != null) form.append("chatId", chatId);
  return request(`${BASE_URL}/upload-multiple`, { method: "POST", body: form });
};

// POST /api/attachments/projects/upload  (files go into a named Project File folder)
export const uploadToProject = ({ projectName, files, chatId, projectId, dueDate }) => {
  const form = new FormData();
  Array.from(files).forEach((f) => form.append("files", f));
  if (projectName) form.append("projectName", projectName);
  if (projectId != null) form.append("projectId", projectId);
  if (chatId != null) form.append("chatId", chatId);
  if (dueDate) form.append("dueDate", dueDate);
  return request(`${BASE_URL}/projects/upload`, { method: "POST", body: form });
};

// GET /api/attachments/projects  (my Project File folders)
export const getMyProjects = async () => toList(await request(`${BASE_URL}/projects`));

// GET /api/attachments/projects/{projectId}  (one project's files)
export const getProject = (projectId) => request(`${BASE_URL}/projects/${projectId}`);