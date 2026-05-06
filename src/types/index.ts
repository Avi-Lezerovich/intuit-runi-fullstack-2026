// Shared type definitions used across the application.

export interface ArticleUser {
  user_id: number;
  name: string;
  username: string;
  profile_image: string;
  profile_image_90: string;
}

export interface ArticleOrganization {
  name: string;
  username: string;
  profile_image_90: string;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  readable_publish_date: string;
  tag_list: string[];
  reading_time_minutes: number;
  url: string;
  user: ArticleUser;
  organization?: ArticleOrganization;
}

export interface User {
  id: number;
  name: string;
  username: string;
  profile_image: string;
  profile_image_90: string;
  post_count: number;
}

export interface FetchUsersResult {
  users: User[];
  hasMore: boolean;
}
