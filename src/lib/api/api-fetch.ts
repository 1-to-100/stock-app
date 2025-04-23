import { getAuth } from "firebase/auth";
interface CustomError extends Error {
  response?: { data: unknown };
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Current user is not authenticated");
  }

  const idToken = await user.getIdToken();

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${idToken}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(path, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = {};
    }
    const error: CustomError = new Error(`HTTP error! status: ${response.status}`);
    error.response = { data };
    throw error;
  }

  if (response.status === 204) {
    return {} as T; // Handle 204 No Content
  }

  return response.json();
}