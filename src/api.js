const API_BASE_URL = "https://dev.to/api";

export const fetchPosts = (page = 1, limit = 10) => {
  return fetch(`${API_BASE_URL}/articles?page=${page}&per_page=${limit}`)
    .then((res) => res.json());
};


export const fetchUsers = (page = 1, limit = 10) => {
  return fetch(`${API_BASE_URL}/articles?page=${page}&per_page=${limit}`)
    .then((res) => res.json())
    .then((articles) =>
      articles.map((article) => ({
        id: article.user.user_id,
        name: article.user.name,
        username: article.user.username,
        profile_image: article.user.profile_image,
        profile_image_90: article.user.profile_image_90,
        twitter_username: article.user.twitter_username,
        github_username: article.user.github_username,
        website_url: article.user.website_url,
      }))
    );
};