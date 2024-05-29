import { NextRequest, NextResponse } from "next/server";
import axios, { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";
import LivestreamModel from "@/models/livestream";
import UserModel from "@/models/user";
import { HUDDLE_API_KEY } from "@/libs/constants";

export async function POST(request: Request) {
  const userPk = request.headers.get("user");
  const livestreamData = await request.json();

  try {
    await connectMongo();

    const creator = await UserModel.findOne({
      publickey: userPk,
    });

    if (!creator) {
      return NextResponse.json(
        { livestream: null },
        { status: HttpStatusCode.NotFound }
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

    console.log("-----------------------------------------");
    const { data } = await axios.post(
      "https://api.huddle01.com/api/v1/create-room",
      {
        title: livestreamData.title,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": HUDDLE_API_KEY,
        },
      }
    );

    const roomId = data.data.roomId;
    console.log("-----------------------------------------", roomId);
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

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const roomId = searchParams.get("roomId");
    const inc = searchParams.get("inc") as string;

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

    let views = -1;
    if (inc === "1") {
      views = 1;
    }

    const result = await LivestreamModel.updateOne(
      { roomId },
      { $inc: { views } }
    );

    return NextResponse.json(
      { livestream: result },
      { status: HttpStatusCode.Ok }
    );
  } catch (errors: any) {
    return NextResponse.json({ status: HttpStatusCode.NotModified });
  }
}
