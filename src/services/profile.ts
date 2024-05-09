import axios from "axios";
import { API_CONFIG } from "../libs/constants";
import { getAccessToken } from "@/libs/helpers";

/// To fetch user data by user name
export const getProfileByUsername = async (username: string) => {
  const { data } = await axios.get(
    `${API_CONFIG}/user/username?username=${username}`
  );
  return data.user;
};

/// To check if the user name is unique
export const uniqueUsername = async (username: string, publicKey: string) => {
  const { data } = await axios.get(
    `${API_CONFIG}/user/unique/${username}?publicKey=${publicKey}`
  );
  return data.unique;
};

/// To update user data
export const updateProfile = async ({
  firstname,
  lastname,
  username,
  description,
  avatar,
  banner,
}: {
  firstname?: string;
  lastname?: string;
  username?: string;
  description?: string;
  avatar?: string;
  banner?: string;
}) => {
  const token = getAccessToken();
  const { data } = await axios.put(
    `${API_CONFIG}/user`,
    { firstname, lastname, username, description, avatar, banner },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return data.user;
};

/// To follow or unfollow the user
export const follow = async (user: string) => {
  const token = getAccessToken();
  const { data } = await axios.post(
    `${API_CONFIG}/user/follow`,
    {
      user,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return data;
};

/// To check if the user has that follower
export const isFollower = async (
  user: string,
  follower: string
): Promise<boolean> => {
  const { data } = await axios.get(
    `${API_CONFIG}/user/is-following?user=${user}&follower=${follower}`
  );
  return data.isFollower;
};

/// To fetch followers
export const fetchFollowers = async (
  publicKey: string,
  user: string,
  page: number = 1
) => {
  const { data } = await axios.get(
    `${API_CONFIG}/user/followers?publicKey=${publicKey}&user=${user}&page=${page}`
  );
  return data.followers;
};
