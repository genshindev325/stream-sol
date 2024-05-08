export type User = {
  firstname: string;
  lastname?: string;
  username: string;
  description?: string;
  publickey: string;
  avatar?: string;
  banner?: string;
  followers: number;
  following: number;
};
