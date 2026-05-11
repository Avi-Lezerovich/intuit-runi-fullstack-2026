/**
 * Centralized API layer.
 * Every fetch in the app goes through here — components never call fetch directly.
 */
import type {
  AuthResponse,
  Post,
  Sort,
  User,
  UserListItem,
  UserProfileResponse,
  VoteResponse,
  VoteSide,
} from "./types";

const BASE = "/api";

// ---------------------------------------------------------------- helpers

/**
 * Wraps fetch with consistent error handling.
 * Throws Error with the server's `error` message (or a fallback) if !res.ok.
 */
const request = async <T>(url: string, init: RequestInit = {}): Promise<T> => {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    });
  } catch {
    throw new Error("שגיאת רשת. ודא שהשרת פעיל.");
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const msg =
      (body && typeof body === "object" && "error" in body && typeof (body as { error: unknown }).error === "string"
        ? (body as { error: string }).error
        : null) || `שגיאה ${res.status}`;
    throw new Error(msg);
  }

  return body as T;
}

/** Build the Authorization header from the token in localStorage (or empty). */
const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ----------------------------------------------------------------- auth

export const signup = (name: string, email: string, password: string): Promise<AuthResponse> => {
  return request<AuthResponse>(`${BASE}/auth/signup`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export const login = (email: string, password: string): Promise<AuthResponse> => {
  return request<AuthResponse>(`${BASE}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ----------------------------------------------------------------- posts

export const fetchPosts = (opts: { sort?: Sort; limit?: number; offset?: number } = {}): Promise<Post[]> => {
  const sp = new URLSearchParams();
  if (opts.sort) sp.set("sort", opts.sort);
  if (typeof opts.limit === "number") sp.set("limit", String(opts.limit));
  if (typeof opts.offset === "number") sp.set("offset", String(opts.offset));
  return request<Post[]>(`${BASE}/posts?${sp.toString()}`);
}

export const fetchPost = (id: number): Promise<Post> => {
  return request<Post>(`${BASE}/posts/${id}`);
}

export const createPost = (payload: {
  title: string;
  body: string;
  defendant: string;
  location?: string;
  charges?: string[];
  damages?: string;
}): Promise<Post> => {
  return request<Post>(`${BASE}/posts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

export const deletePost = (id: number): Promise<{ deleted: number }> => {
  return request<{ deleted: number }>(`${BASE}/posts/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export const votePost = (id: number, side: VoteSide): Promise<VoteResponse> => {
  return request<VoteResponse>(`${BASE}/posts/${id}/vote`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ side }),
  });
}

// ----------------------------------------------------------------- users

export const fetchUsers = (opts: { search?: string; limit?: number; offset?: number } = {}): Promise<UserListItem[]> => {
  const sp = new URLSearchParams();
  if (opts.search) sp.set("search", opts.search);
  if (typeof opts.limit === "number") sp.set("limit", String(opts.limit));
  if (typeof opts.offset === "number") sp.set("offset", String(opts.offset));
  return request<UserListItem[]>(`${BASE}/users?${sp.toString()}`);
}

export const fetchUserProfile = (id: number): Promise<UserProfileResponse> => {
  return request<UserProfileResponse>(`${BASE}/users/${id}`);
}

// ----------------------------------------------------------- session helpers

export const getStoredUser = (): User | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

// ----------------------------------------------- "your vote" memory (local)
// The API does not (yet) return which side the current user voted on, so we
// remember it client-side keyed by user id. Cleared on logout.

const VOTES_KEY = (userId: number) => `myVotes_${userId}`;

const readVotes = (userId: number): Record<string, VoteSide> => {
  const raw = localStorage.getItem(VOTES_KEY(userId));
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export const getMyVote = (postId: number): VoteSide | null => {
  const user = getStoredUser();
  if (!user) return null;
  return readVotes(user.id)[String(postId)] ?? null;
}

export const setMyVote = (postId: number, side: VoteSide): void => {
  const user = getStoredUser();
  if (!user) return;
  const votes = readVotes(user.id);
  votes[String(postId)] = side;
  localStorage.setItem(VOTES_KEY(user.id), JSON.stringify(votes));
}

export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem("token");
}

export const saveSession = (token: string, user: User): void => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  // Notify same-tab listeners (storage event only fires for OTHER tabs)
  window.dispatchEvent(new Event("auth-change"));
}

export const clearSession = (): void => {
  // Wipe vote memory for the logged-in user before tossing the user blob,
  // so the next login starts with a clean slate.
  const user = getStoredUser();
  if (user) localStorage.removeItem(VOTES_KEY(user.id));
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("auth-change"));
}
