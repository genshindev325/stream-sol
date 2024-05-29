import axios from "axios";
import { API_CONFIG } from "../libs/constants";
import { HUDDLE_API_KEY } from "../libs/constants";

export const getRoomAccessToken = async ({
  roomId,
  publicKey,
}: {
  roomId: string;
  publicKey: string;
}) => {
  try {
    const { data } = await axios.get(
      `${API_CONFIG}/token?roomId=${roomId}&&publicKey=${publicKey}`
    );
    return data.token;
  } catch (error) {
    // console.error("Error fetching room access token:", error);
  }
};

export const getRoomList = async () => {
  const res = await axios.get(
    'https://api.huddle01.com/api/v1/get-rooms',
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': HUDDLE_API_KEY,
      }
    }
  );
}
