import { API_CONFIG } from "@/libs/constants";
import { getAccessToken } from "@/libs/helpers";
import { User } from "@/libs/types";
import axios from "axios";

export const createArchievedstream = async ({
  title,
  description,
  thumbnail,
  roomId,
  creator,
  video,
}: {
  title: string;
  description: string;
  thumbnail: string;
  roomId: string;
  creator: string;
  video: string;
}) => {
  const token = getAccessToken();
  const { data } = await axios.post(
    `${API_CONFIG}/archievedstream`,
    { title, description, thumbnail, roomId, creator, video },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return data;
};

/// To fetch archievestreams
export const fetchArchievedstreams = async ({
  publicKey,
  pageNum,
}: {
  publicKey: string;
  pageNum: string;
}) => {
  const { data } = await axios.get(
    `${API_CONFIG}/archievedstream/all?publicKey=${publicKey}&&pageNum=${pageNum}`
  );
  return data;
};

/// Get archievedstream by id
export const getArchievedstreamById = async ({
  archievedstreamId,
}: {
  archievedstreamId: string;
}) => {
  const { data } = await axios.get(
    `${API_CONFIG}/archievedstream?archievedstreamId=${archievedstreamId}`
  );
  return data;
};
