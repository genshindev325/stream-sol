import { API_CONFIG } from "@/libs/constants";
import axios from "axios";
import { getAccessToken } from "@/libs/helpers";

// To fetch videos
export const fetchVideos = async ({
  publicKey,
  pageNum,
}: {
  publicKey: string;
  pageNum: string;
}) => {
  const { data } = await axios.get(
    `${API_CONFIG}/video/all?pubkey=${publicKey}&&pageNum=${pageNum}`
  );
  return data;
};

// Get video by id
export const getVideoById = async ({ videoId }: { videoId: string }) => {
  const { data } = await axios.get(`${API_CONFIG}/video?videoId=${videoId}`);
  return data;
};

// Create Video
export const createVideo = async ({
  title,
  description,
  url,
  thumbnail,
}: {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
}) => {
  const token = getAccessToken();
  const { data } = await axios.post(
    `${API_CONFIG}/video`,
    { title, description, url, thumbnail },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return data;
};
