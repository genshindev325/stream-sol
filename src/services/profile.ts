import axios from "axios";
import { API_CONFIG } from "../libs/constants";
import { getAccessToken } from "@/libs/helpers";

export const getProfileByUsername = async (username: string) => {
  const { data } = await axios.get(
    `${API_CONFIG}/user/username?username=${username}`
  );
  return data.user;
};

export const uniqueUsername = async (username: string, publicKey: string) => {
  const { data } = await axios.get(
    `${API_CONFIG}/user/unique/${username}?publicKey=${publicKey}`
  );
  return data.unique;
};

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
