import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/libs/connect-mongo";
import LivestreamModel from "@/models/livestream";
import { HttpStatusCode } from "axios";
import UserModel from "@/models/user";

export async function POST(request: Request) {
  const userPk = request.headers.get("user");
  const livestreamData = await request.json();

  try {
    const creator = await UserModel.findOne({
      publickey: userPk,
    });

    if (!creator) {
      return NextResponse.json(
        { livestream: null },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const stream = await LivestreamModel.findOne({
      "creator.publickey": userPk,
    });

    if (stream) {
      return NextResponse.json(
        { livestream: null },
        { status: HttpStatusCode.Conflict }
      );
    }

    const response = await fetch(
      "https://api.huddle01.com/api/v1/create-room",
      {
        method: "POST",
        body: JSON.stringify({
          title: livestreamData.title,
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

    await connectMongo();

    const livestream = new LivestreamModel({
      ...livestreamData,
      creator,
      roomId,
    });

    await livestream.save();

    return NextResponse.json(
      { livestream },
      { status: HttpStatusCode.Created }
    );
  } catch (errors: any) {
    return NextResponse.json(
      { livestream: null },
      { status: HttpStatusCode.BadRequest }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const roomId = searchParams.get("roomId");

  await connectMongo();

  const livestream = await LivestreamModel.findOne({
    roomId,
  });

  if (!livestream) {
    return NextResponse.json(
      { message: "Livestream Does Not Exist" },
      { status: HttpStatusCode.NotFound }
    );
  }

  return NextResponse.json({ livestream }, { status: HttpStatusCode.Ok });
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const roomId = searchParams.get("roomId");

  await connectMongo();

  const livestream = await LivestreamModel.deleteOne({
    roomId,
  });

  if (!livestream) {
    return NextResponse.json(
      { message: "Livestream Does Not Exist" },
      { status: HttpStatusCode.NotFound }
    );
  }

  return NextResponse.json(
    { Message: "Successfully deleted!" },
    { status: HttpStatusCode.Ok }
  );
}
