const API_BASE_URL = "https://dev.to/api";

export const fetchPosts = (page = 1, limit = 10) => {
  return fetch(`${API_BASE_URL}/articles?page=${page}&per_page=${limit}`)
    .then((res) => res.json());
};


export const fetchUserPostCount = async (username) => {
  const response = await fetch(`https://dev.to/${username}`);
  const profilePage = await response.text();
  const match = profilePage.match(/(\d+)\s+posts?\s+published/i);

  if (match) {
    return Number(match[1]);
  }

  return 0;
};


export const fetchUsers = (page = 1, limit = 10) => {
  return fetch(`${API_BASE_URL}/articles?page=${page}&per_page=${limit}`)
    .then((res) => res.json())
    .then((articles) => {
      const uniqueUsers = Object.values(
        articles.reduce((acc, article) => {
          const user = article.user;
          if (user && !acc[user.user_id]) {
            acc[user.user_id] = user;
          }
          return acc;
        }, {})
      );

      return Promise.all(
        uniqueUsers.map((user) =>
          fetchUserPostCount(user.username).then((post_count) => ({
            id: user.user_id,
            name: user.name,
            username: user.username,
            profile_image: user.profile_image,
            profile_image_90: user.profile_image_90,
            post_count,
          }))
        )
      ).then((users) => ({
        users,
        hasMore: articles.length === limit,
      }));
    });
};