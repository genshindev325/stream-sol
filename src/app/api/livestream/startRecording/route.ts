import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { Recorder } from "@huddle01/server-sdk/recorder";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");

    if (
      !process.env.NEXT_PUBLIC_HUDDLE_PROJECT_ID &&
      !process.env.NEXT_PUBLIC_HUDDLE_API_KEY
    ) {
      return NextResponse.json({
        error: "NEXT_PUBLIC_PROJECT_ID and API_KEY are required",
      });
    }

    const recorder = new Recorder(
      process.env.NEXT_PUBLIC_HUDDLE_PROJECT_ID!,
      process.env.NEXT_PUBLIC_HUDDLE_API_KEY!
    );

    const token = new AccessToken({
      apiKey: process.env.NEXT_PUBLIC_HUDDLE_API_KEY!,
      roomId: roomId as string,
      role: Role.BOT,
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
    });

    const accessToken = await token.toJwt();

    const recording = await recorder.startRecording({
      roomId: roomId as string,
      token: accessToken,
    });

    console.log("recording", roomId, accessToken, recording);

    return NextResponse.json({ recording }, { status: HttpStatusCode.Ok });
  } catch (error) {
    console.log(error);
  }
}
