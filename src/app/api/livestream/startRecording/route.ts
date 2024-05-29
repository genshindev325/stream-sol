import { type NextRequest, NextResponse } from "next/server";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { Recorder } from "@huddle01/server-sdk/recorder";
import { HttpStatusCode } from "axios";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const roomId = searchParams.get("roomId") as string;

  try {
    const recorder = new Recorder(
      process.env.NEXT_PUBLIC_HUDDLE_PROJECT_ID!,
      process.env.NEXT_PUBLIC_HUDDLE_API_KEY!
    );

    const token = new AccessToken({
      apiKey: process.env.NEXT_PUBLIC_HUDDLE_API_KEY!,
      roomId: roomId,
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
      options: {
        metadata: {
          botId: roomId,
        },
      },
    });

    const accessToken = await token.toJwt();

    const recording = await recorder.startRecording({
      roomId: roomId as string,
      token: accessToken,
    });

    console.log(`recording >>>>>
      roomId: ${roomId}
      accessToken: ${accessToken}
      recording: ${recording.msg}`);

    return NextResponse.json(
      { recording: null },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    return NextResponse.json(
      { recording: null },
      { status: HttpStatusCode.BadRequest }
    );
  }
}
