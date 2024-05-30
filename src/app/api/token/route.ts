import connectMongo from "@/libs/connect-mongo";
import LivestreamModel from "@/models/livestream";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";
import { HUDDLE_API_KEY } from "@/libs/constants";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    await connectMongo();

    const roomId = searchParams.get("roomId") as string;
    const publicKey = searchParams.get("publicKey") as string;

    if (!publicKey || !roomId) {
      return NextResponse.json({}, { status: HttpStatusCode.BadRequest });
    }

    console.log("-----------------------------------");
    console.log(publicKey, roomId);
    const livestream = await LivestreamModel.findOne({
      roomId,
    });

    if (!livestream) {
      return NextResponse.json({}, { status: HttpStatusCode.BadRequest });
    }

    const creator = livestream.creator;

    const accessToken = new AccessToken(
      publicKey == creator.publickey
        ? {
            apiKey: HUDDLE_API_KEY,
            roomId: roomId,
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
                walletAddress: publicKey,
                displayName: "",
              },
            },
          }
        : {
            apiKey: HUDDLE_API_KEY,
            roomId: roomId,
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
              canSendData: true,
              canUpdateMetadata: true,
            },
            options: {
              metadata: {
                walletAddress: publicKey,
                displayName: "",
              },
            },
          }
    );

    const token: string = await accessToken.toJwt();
    return NextResponse.json({ token }, { status: HttpStatusCode.Ok });
  } catch (errors: any) {
    return NextResponse.json({}, { status: HttpStatusCode.BadRequest });
  }
}
