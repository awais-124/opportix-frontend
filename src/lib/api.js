// const API_URL = import.meta.env.VITE_API_URL;

const API_URL =
  "https://opportix-backend.vercel.app" || import.meta.env.VITE_API_URL;

console.log("using URL ===> ", API_URL);
function requireUrl() {
  if (!API_URL) {
    throw new Error(
      "VITE_API_URL environment variable is not set. " +
        "Locally, add it to frontend/.env. On Vercel, set it in project settings.",
    );
  }
  return API_URL;
}

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

class ApiClient {
  constructor() {
    this.baseUrl = requireUrl();
  }

  getToken() {
    try {
      const raw = localStorage.getItem("supabase.auth.token");
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed?.currentSession?.access_token || null;
      }
    } catch {
      // ignore parse errors
    }
    return null;
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = { "Content-Type": "application/json", ...options.headers };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        data.error?.message ||
        (typeof data.error === "string" ? data.error : null) ||
        `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data.error?.details);
    }

    return data.data !== undefined ? data.data : data;
  }

  get(endpoint, params) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request(`${endpoint}${query}`, { method: "GET" });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient();
export { ApiError };
