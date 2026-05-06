// All post-related API calls live here.

import { apiFetch } from "./client";
import { PAGE_SIZE } from "../constants/config";
import type { Article } from "../types";

export const fetchPosts = (page = 1, limit = PAGE_SIZE): Promise<Article[]> =>
  apiFetch<Article[]>(`/articles?page=${page}&per_page=${limit}`);

// Placeholder create endpoint used by the New Post form.
export const createPost = ({ title, body }: { title: string; body: string }) =>
  apiFetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body, userId: 1 }),
  });
