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
