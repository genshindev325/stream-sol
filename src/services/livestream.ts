import axios from "axios";
import { API_CONFIG } from "../libs/constants";
import { getAccessToken } from "@/libs/helpers";

export const createRoom = async ({ title }: { title: string }) => {
  const token = getAccessToken();
  try {
    const { data } = await axios.post(
      `${API_CONFIG}/livestream/createRoom`,
      { title },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return data;
  } catch (error) {}
};

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
  const { data } = await axios.get(
    `${API_CONFIG}/livestream/all?page=${page}&&search=${search}`
  );
  return data;
};

export const startRecording = async (roomId: string) => {
  const data = await axios.get(
    `${API_CONFIG}/livestream/startRecording?roomId=${roomId}`
  );
  return data;
};

export const stopRecording = async (roomId: string) => {
  const data = await axios.get(
    `${API_CONFIG}/livestream/stopRecording?roomId=${roomId}`
  );
  return data;
};
