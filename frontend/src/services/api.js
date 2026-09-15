// api.js
// ------------------------------------------------------
// Central HTTP API client.
//
// Responsibilities:
// - Send requests to the backend
// - Attach access token when provided
// - Send cookies for refresh-token authentication
// - Parse backend responses
// - Convert backend errors into JavaScript errors
// ------------------------------------------------------

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

async function apiRequest(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    token,
  } = options;

  const headers = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      method,
      headers,
      credentials: "include",
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "The server returned an invalid response."
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      "Something went wrong."
    );
  }

  return data;
}

export {
  API_URL,
  apiRequest,
};