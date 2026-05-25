import { api } from "./api.js";

export async function uploadCV(file) {
  const formData = new FormData();
  formData.append("file", file);

  const token = api.getToken();
  const response = await fetch(`${api.baseUrl}/api/upload/cv`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data.error?.message || data.error || "Upload failed";
    throw new Error(message);
  }

  return data.data;
}
