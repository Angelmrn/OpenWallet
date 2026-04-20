const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:1234/api";

let accessToken: string | null = null;
let isRedirecting = false;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      isRedirecting = false;
      return null;
    }
    const data = await response.json();
    accessToken = data.accessToken;
    return accessToken;
  } catch {
    return null;
  }
}

export async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const makeRequest = async (token: string | null) => {
    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  };
  let response = await makeRequest(accessToken);
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      if (typeof window !== "undefined" && !isRedirecting) {
        isRedirecting = true;
        clearSession();
        window.location.href = "/login";
      }
      throw new Error("Session expired");
    }
    response = await makeRequest(newToken);
  }
  const data = await response.json();
  console.log("FETCHER: ", data);
  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }
  return data as T;
}

export const saveSession = () => {
  document.cookie = "hasSession=true; path=/; SameSite=Lax";
};

export const clearSession = () => {
  document.cookie = "hasSession=false; path=/; max-age=0";
  accessToken = null;
};
