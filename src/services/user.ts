import axios from "axios";
import { API_CONFIG } from "../libs/constants";
import { getAccessToken } from "@/libs/helpers";

export const signUp = async ({
  firstname,
  lastname,
  username,
  description,
}: {
  firstname: string;
  lastname: string;
  username: string;
  description: string;
}) => {
  const token = getAccessToken();
  const { data } = await axios.post(
    `${API_CONFIG}/user`,
    { firstname, lastname, username, description },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return data.user;
};
