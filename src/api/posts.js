// All post-related API calls live here.

import { apiFetch } from "./client";
import { PAGE_SIZE } from "../constants/config";

export const fetchPosts = (page = 1, limit = PAGE_SIZE) =>
  apiFetch(`/articles?page=${page}&per_page=${limit}`);
