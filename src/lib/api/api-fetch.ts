import { getAuth } from "firebase/auth";
import {AuthStrategy} from "@/lib/auth/strategy";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import {config} from "@/config";

interface CustomError extends Error {
  response?: { data: unknown };
}

export async function getAccessToken(strategy: keyof typeof AuthStrategy): Promise<string> {
  if (strategy === AuthStrategy.FIREBASE) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Current user is not authenticated with Firebase");
    }

    return user.getIdToken();
  }

  if (strategy === AuthStrategy.SUPABASE) {
    const supabaseClient = createSupabaseClient();
    const session = await supabaseClient.auth.getSession();
    if (!session || !session.data.session) {
      throw new Error("Current user is not authenticated with Supabase");
    }

    return session.data.session.access_token;
  }

  throw new Error("Unsupported authentication strategy");
}


export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const idToken = await getAccessToken(config.auth.strategy);

  const response = await fetch(path, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error: CustomError = new Error(`HTTP error! status: ${response.status}`);
    try {
      error.response = { data: await response.json() };
    } catch {
      error.response = { data: {} };
    }
    throw error;
  }

  return response.status === 204 ? ({} as T) : response.json();
}