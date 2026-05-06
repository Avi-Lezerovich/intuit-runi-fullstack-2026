// All post-related API calls live here.

import { apiFetch } from "./client";
import { PAGE_SIZE } from "../constants/config";
import type { Article } from "../types";

export const fetchPosts = (page = 1, limit = PAGE_SIZE, userId?: string): Promise<Article[]> =>
  apiFetch<Article[]>(
    userId
      ? `/articles?username=${userId}&page=${page}&per_page=${limit}`
      : `/articles?page=${page}&per_page=${limit}`
  );

// Placeholder create endpoint used by the New Post form.
export const createPost = async ({ title, body }: { title: string; body: string }) => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return a mock successful response
  return {
    id: Math.floor(Math.random() * 10000),
    title,
    body,
    userId: 1,
  };
};
