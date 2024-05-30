import { type NextRequest, NextResponse } from "next/server";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { Recorder } from "@huddle01/server-sdk/recorder";
import { HttpStatusCode } from "axios";
import LivestreamModel from "@/models/livestream";
import connectMongo from "@/libs/connect-mongo";
import { HUDDLE_API_KEY, HUDDLE_PROJECT_ID } from "@/libs/constants";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const roomId = searchParams.get("roomId") as string;

  try {
    await connectMongo();

    const livestream = await LivestreamModel.findOne({
      roomId,
    });

    if (!livestream) {
      return NextResponse.json(
        { recording: null },
        { status: HttpStatusCode.NotFound }
      );
    }

    const recorder = new Recorder(HUDDLE_PROJECT_ID, HUDDLE_API_KEY);

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

    console.log("start -----------------------------------------");

    const recording = await recorder.startRecording({
      roomId,
      token: accessToken,
    });

    console.log(recording);

    livestream.recording = true;

    await livestream.save();

    return NextResponse.json(
      { recording: null },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    return NextResponse.json({}, { status: HttpStatusCode.BadRequest });
  }
}
