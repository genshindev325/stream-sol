import axios from "axios";
import { API_CONFIG } from "../libs/constants";
import { getAccessToken } from "@/libs/helpers";

export const createLivestream = async ({
  title,
  description,
  text,
  link,
  thumbnail,
}: {
  title: string;
  description: string;
  text: string;
  link: string;
  thumbnail: string;
}) => {
  const token = getAccessToken();
  const { data } = await axios.post(
    `${API_CONFIG}/livestream`,
    { title, description, text, link, view: 0, thumbnail },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  console.log("Data: ", data);
  return data;
};
