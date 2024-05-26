import axios from "axios";
import { API_CONFIG } from "../libs/constants";
import { getAccessToken } from "@/libs/helpers";

export const createLivestream = async ({
  title,
  description,
  text,
  link,
  thumbnail,
  roomId,
}: {
  title: string;
  description: string;
  text: string;
  link: string;
  thumbnail: string;
  roomId: string;
}) => {
  const token = getAccessToken();
  const { data } = await axios.post(
    `${API_CONFIG}/livestream`,
    { title, description, text, link, view: 0, thumbnail, roomId },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  console.log("Data: ", data);
  return data;
};

export const getLivestreamByRoomId = async (roomId: string) => {
  const { data } = await axios.get(`${API_CONFIG}/livestream?roomId=${roomId}`);
  return data;
};

export const getAllLivestreams = async (page: string, search: string) => {
  const {data} = await axios.get(`${API_CONFIG}/livestream/all?page=${page}&&search=${search}`);
  return data;
}