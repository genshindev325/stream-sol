import axios from "axios";
import { API_CONFIG } from "../libs/constants";
import { getAccessToken } from "@/libs/helpers";

export const signUp = async () => {
  const token = getAccessToken();
  const { data } = await axios.post(
    `${API_CONFIG}/user`,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return data;
};
