import axios from "axios";
import { API_CONFIG } from "../libs/constants";
import { getAccessToken } from "@/libs/helpers";

export const creatChat = async ({
  roomId,
  sender,
  pfp,
  content,
}: {
  roomId: string;
  sender: string;
  pfp?: string;
  content: string;
}) => {
  const token = getAccessToken();
  try {
    const { data } = await axios.post(
      `${API_CONFIG}/chat`,
      { roomId, sender, pfp, content },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Error in creating a chat: ", error);
  }
};

export const getChatHistory = async ({
  livestreamId,
}: {
  livestreamId: string;
}) => {
  const { data } = await axios.get(
    `${API_CONFIG}/chat?livestreamId=${livestreamId}`
  );
  return data;
};
