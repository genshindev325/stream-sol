import Livestream from "@/app/livestream/[roomId]/page";
import connectMongo from "@/libs/connect-mongo";
import LivestreamModel from "@/models/livestream";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  await connectMongo();

  const roomId = searchParams.get("roomId");
  let role = "";
  const publicKey = searchParams.get("publicKey");

  console.log("Publick Key: ", publicKey);

  // Check publicKey is the host's or not
  const livestream = await LivestreamModel.find({
    roomId,
  });
  const creator = livestream[0].creator;
  publicKey == creator.publickey ? (role = "host") : (role = "listener");

  if (!roomId) {
    return new Response("Missing roomId", { status: 400 });
  }

  const accessToken = new AccessToken(
    role == "host"
      ? {
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
        }
      : {
          apiKey: process.env.NEXT_PUBLIC_HUDDLE_API_KEY!,
          roomId: roomId as string,
          role: Role.LISTENER,
          permissions: {
            admin: false,
            canConsume: true,
            canProduce: false,
            canProduceSources: {
              cam: false,
              mic: false,
              screen: false,
            },
            canRecvData: true,
            canSendData: false,
            canUpdateMetadata: true,
          },
          options: {
            metadata: {
              // you can add any custom attributes here which you want to associate with the user
              walletAddress: publicKey,
            },
          },
        }
  );

  // return new Response(token, { status: 200 });

  try {
    const token = await accessToken.toJwt();
    return NextResponse.json({ token }, { status: HttpStatusCode.Ok });
  } catch (errors: any) {
    return NextResponse.json({ status: HttpStatusCode.BadRequest });
  }
}
