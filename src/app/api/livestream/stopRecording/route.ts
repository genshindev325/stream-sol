import { type NextRequest, NextResponse } from "next/server";
import { Recorder } from "@huddle01/server-sdk/recorder";
import { HttpStatusCode } from "axios";
import LivestreamModel from "@/models/livestream";
import connectMongo from "@/libs/connect-mongo";
import { HUDDLE_API_KEY, HUDDLE_PROJECT_ID } from "@/libs/constants";

interface Recordings {
  id: string;
  recordingUrl: string;
  recordingSize: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const roomId = searchParams.get("roomId") as string;

  try {
    await connectMongo();

    const livestream = await LivestreamModel.findOne({
      roomId,
    });

    if (!livestream || livestream.recording === false) {
      return NextResponse.json(
        { recording: null },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const recorder = new Recorder(HUDDLE_PROJECT_ID, HUDDLE_API_KEY);

    console.log("end -----------------------------------------");

    const recording = await recorder.stop({
      roomId,
    });

    console.log(recording);

    const { msg } = recording;

    if (msg === "Stopped") {
      const response = await fetch(
        "https://api.huddle01.com/api/v1/get-recordings",
        {
          headers: {
            "x-api-key": HUDDLE_API_KEY,
          },
        }
      );
      const data = await response.json();

      const { recordings } = data as { recordings: Recordings[] };

      livestream.recording = false;
      await livestream.save();

      return NextResponse.json(
        { recording: recordings[0] },
        { status: HttpStatusCode.Ok }
      );
    }

    return NextResponse.json({}, { status: HttpStatusCode.BadRequest });
  } catch (error) {
    return NextResponse.json({}, { status: HttpStatusCode.BadRequest });
  }
}
