import axios from "axios";
import { API_CONFIG } from "../libs/constants";
import { getAccessToken } from "@/libs/helpers";

/// To fetch announcements by user public key
export const fetchAnnouncements = async (
  publicKey: string,
  user: string,
  page: Number
) => {
  const { data } = await axios.get(
    `${API_CONFIG}/announcement?pubkey=${publicKey}&user=${user}&page=${page}`
  );
  return data;
};

/// To update user data
export const createAnnouncement = async (content: string) => {
  const token = getAccessToken();
  const { data } = await axios.post(
    `${API_CONFIG}/announcement`,
    { content },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return data.announcement;
};

/// To like or cancel like
export const doLikeAnnouncement = async (id: string) => {
  const token = getAccessToken();
  const { data } = await axios.post(
    `${API_CONFIG}/announcement/like?id=${id}&liked=true`,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return data.announcement;
};

/// To dislike or cancel dislike
export const doDislikeAnnouncement = async (id: string) => {
  const token = getAccessToken();
  const { data } = await axios.post(
    `${API_CONFIG}/announcement/like?id=${id}`,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return data.announcement;
};
