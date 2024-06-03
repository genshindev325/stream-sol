export type User = {
  id: string;
  firstname: string;
  lastname?: string;
  fullname: string;
  username: string;
  description?: string;
  publickey: string;
  avatar?: string;
  banner?: string;
  followers: number;
  followings: number;
};

export enum AlikeEnum {
  Like,
  Dislike,
  None,
}

export type Announcement = {
  id: string;
  user: string;
  content: string;
  likes: number;
  dislikes: number;
  userLiked: AlikeEnum;
  createdAt: string;
};

export type TPeerMetadata = {
  displayName: string;
};

export type Livestream = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  video: string;
  text: string;
  link: string;
  views: number;
  likes: number;
  dislikes: number;
  creator: User;
  roomId: string;
  createdAt: string;
  recording: boolean;
};

export type Video = {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  creator: string;
  roomId: string;
  url: string;
  createdAt: string;
};
