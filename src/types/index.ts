// Shared type definitions used across the application.

export interface UserProfile {
  name: string;
  username: string;
  profile_image: string;
  profile_image_90: string;
  github_username?: string;
  twitter_username?: string;
  linkedin_username?: string;
  website_url?: string;
}

export interface ArticleUser extends UserProfile {
  user_id: number;
}

export interface ArticleOrganization extends Pick<UserProfile, "name" | "username" | "profile_image_90"> {
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

export interface User extends UserProfile {
  id: number;
  post_count: number;
}

export interface FetchUsersResult {
  users: User[];
  hasMore: boolean;
}
