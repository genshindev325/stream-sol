import { NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    const response = await fetch(
      "https://api.huddle01.com/api/v1/create-room",
      {
        method: "POST",
        body: JSON.stringify({
          title: title,
        }),
        headers: {
          "Content-type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_HUDDLE_API_KEY!,
        },
        cache: "no-cache",
      }
    );

    const data = await response.json();
    const roomId = data.data.roomId;
    return NextResponse.json({ roomId }, { status: HttpStatusCode.Ok });
  } catch (error) {
    console.log("Error in creating a huddle room: ", error);
  }
}
