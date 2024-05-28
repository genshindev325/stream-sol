import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PROTECTED_ROUTES } from "@/libs/constants";
import nacl from "tweetnacl";
import base58 from "bs58";
import { PublicKey } from "@solana/web3.js";
import { DateTime } from "luxon";

const authentiateToken = async (
  request: NextRequest
): Promise<string | null> => {
  const bearerToken = request.headers.get("Authorization");

  if (!bearerToken) {
    return null;
  }

  const token = bearerToken.split(" ")[1];
  const [pk, msg, sig] = token.split(".");
  const hasValidSig = nacl.sign.detached.verify(
    base58.decode(msg),
    base58.decode(sig),
    new PublicKey(pk).toBytes()
  );

  if (!hasValidSig) {
    return null;
  }

  const contents = JSON.parse(new TextDecoder().decode(base58.decode(msg)));

  if (DateTime.local().toUTC().toUnixInteger() > contents.exp) {
    return null;
  }

  return pk;
};

export async function middleware(request: NextRequest) {
  if (request.method !== "GET") {
    try {
      const user = await authentiateToken(request);
      if (user) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("user", user);
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      }

      throw new Error();
    } catch (err) {
      return NextResponse.json(
        { message: "authentication failed" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
