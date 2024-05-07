import { DateTime } from "luxon";
import b58 from "bs58";
import axios from "axios";
import { PublicKey } from "@solana/web3.js";
import { setAccessToken } from "@/libs/helpers";
import { API_CONFIG } from "@/libs/constants";
import { User } from "@/libs/types";

type MessageSigner = {
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  publicKey: PublicKey;
};

export const createAuthToken = async (
  wallet: MessageSigner,
  exp: number = 10080
) => {
  const encodedMessage = new TextEncoder().encode(
    JSON.stringify({
      exp: DateTime.local().toUTC().plus({ minutes: exp }).toUnixInteger(),
    })
  );

  const signature = await wallet.signMessage(encodedMessage);

  const pk = wallet.publicKey.toBase58();
  const msg = b58.encode(encodedMessage);
  const sig = b58.encode(signature);
  return `${pk}.${msg}.${sig}`;
};

export const verifyToken = async (token: string) : Promise<User | null> => {
  const { data } = await axios.post(
    `${API_CONFIG}/auth/verify-token`,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  setAccessToken(token);
  return data.user;
};
