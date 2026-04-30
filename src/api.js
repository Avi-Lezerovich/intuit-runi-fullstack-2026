export const fetchPosts = (page = 1, limit = 10) => {
  return fetch(`https://dev.to/api/articles?page=${page}&per_page=${limit}`)
    .then((res) => res.json());
};
