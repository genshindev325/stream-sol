import { API_CONFIG } from "@/libs/constants";
import axios from "axios";
import { getAccessToken } from "@/libs/helpers";

// To fetch archived videos
export const fetchArchivedVideos = async ({
  publicKey,
  pageNum,
}: {
  publicKey: string;
  pageNum: number;
}) => {
  const { data } = await axios.get(
    `${API_CONFIG}/video/archived?pubkey=${publicKey}&&pageNum=${pageNum}`
  );
  return data;
};

// To fetch all videos
export const fetchAllVideos = async ({
  publicKey,
  pageNum,
}: {
  publicKey: string;
  pageNum: number;
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
export const archiveVideo = async ({
  roomId,
  video,
}: {
  roomId: string;
  video: string;
}) => {
  const token = getAccessToken();
  const { data } = await axios.put(
    `${API_CONFIG}/livestream?roomId=${roomId}`,
    { video },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return data;
};

export const deleteVideo = async ({ videoId }: { videoId: string }) => {
  const token = getAccessToken();
  const { data } = await axios.delete(
    `${API_CONFIG}/video?videoId=${videoId}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return data;
};
