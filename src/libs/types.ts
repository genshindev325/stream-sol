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
  title: string;
  description?: string;
  thumbnail: string;
  text: string;
  link: string;
  views: number;
  creator: User;
  roomId: string;
};

export type Archievedstream = {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  creator: string;
  roomId: string;
  video: string;
};
