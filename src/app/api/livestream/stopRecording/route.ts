import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { Recorder } from "@huddle01/server-sdk/recorder";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

interface Recordings {
  id: string;
  recordingUrl: string;
  recordingSize: number;
}

export async function GET(request: NextRequest) {
  try {
    // const { searchParams } = new URL(request.url);
    const searchParams = request.nextUrl.searchParams;
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

    const recording = await recorder.stop({
      roomId: roomId as string,
    });
    console.log("recording", roomId, recording);

    const { msg } = recording;

    if (msg === "Stopped") {
      const response = await fetch(
        "https://api.huddle01.com/api/v1/get-recordings",
        {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_HUDDLE_API_KEY!,
          },
        }
      );
      const data = await response.json();

      const { recordings } = data as { recordings: Recordings[] };

      console.log(recordings);

      return NextResponse.json(
        { recording: recordings[0] },
        { status: HttpStatusCode.Ok }
      );
    }

    return NextResponse.json({ recording }, { status: HttpStatusCode.Ok });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ recording: null }, { status: HttpStatusCode.BadRequest });
  }
}
