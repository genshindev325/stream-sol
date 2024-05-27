import axios from "axios";
import { API_CONFIG } from "../libs/constants";

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
