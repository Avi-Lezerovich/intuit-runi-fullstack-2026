// Tiny fetch wrapper — every API module should go through this so error handling,
// base URLs, and headers stay consistent in one place.

import { API_BASE_URL } from "../constants/config";

export const apiFetch = async (path, options = {}) => {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Some calls (e.g. scraping a public profile page) need raw HTML, not JSON.
export const apiFetchText = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.text();
};
