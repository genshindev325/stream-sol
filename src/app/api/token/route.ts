import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const roomId = searchParams.get("roomId");
  const publicKey = searchParams.get("publicKey");

  if (!roomId) {
    return new Response("Missing roomId", { status: 400 });
  }

  const accessToken = new AccessToken({
    apiKey: process.env.NEXT_PUBLIC_HUDDLE_API_KEY!,
    roomId: roomId as string,
    role: Role.HOST,
    permissions: {
      admin: true,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
    options: {
      metadata: {
        // you can add any custom attributes here which you want to associate with the user
        walletAddress: publicKey,
      },
    },
  });

  // return new Response(token, { status: 200 });

  try {
    const token = await accessToken.toJwt();
    return NextResponse.json({ token }, { status: HttpStatusCode.Ok });
  } catch (errors: any) {
    return NextResponse.json({ status: HttpStatusCode.BadRequest });
  }
}
