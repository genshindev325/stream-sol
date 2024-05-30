import { API_CONFIG } from "@/libs/constants";
import axios from "axios";

/// To fetch videos
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

/// Get video by id
export const getVideoById = async ({ videoId }: { videoId: string }) => {
  const { data } = await axios.get(`${API_CONFIG}/video?videoId=${videoId}`);
  return data;
};
