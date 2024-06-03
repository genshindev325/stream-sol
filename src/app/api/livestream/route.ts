import { NextRequest, NextResponse } from "next/server";
import axios, { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";
import UserModel from "@/models/user";
import { HUDDLE_API_KEY } from "@/libs/constants";
import LivestreamModel from "@/models/livestream";

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
      archived: false,
    });

    if (stream) {
      return NextResponse.json(
        { livestream: null },
        { status: HttpStatusCode.Conflict }
      );
    }

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

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const roomId = searchParams.get("roomId") as string;
  const livestreamData = await request.json();

  try {
    await connectMongo();

    const livestream = await LivestreamModel.findOneAndUpdate(
      {
        roomId,
      },
      { ...livestreamData }
    );

    if (!livestream) {
      return NextResponse.json(
        { message: "Livestream Does Not Exist" },
        { status: HttpStatusCode.NotFound }
      );
    }

    return NextResponse.json({ livestream }, { status: HttpStatusCode.Ok });
  } catch (errors: any) {
    return NextResponse.json({ status: HttpStatusCode.NotModified });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const roomId = searchParams.get("roomId");

  try {
    await connectMongo();

    const livestream = await LivestreamModel.findOne({
      roomId,
      archived: false,
    });

    if (!livestream) {
      return NextResponse.json(
        { message: "Livestream Does Not Exist" },
        { status: HttpStatusCode.NotFound }
      );
    }

    livestream.archived = true;
    await livestream.save();

    return NextResponse.json(
      { Message: "Successfully deleted!" },
      { status: HttpStatusCode.Ok }
    );
  } catch (err) {
    return NextResponse.json(
      { Message: "Failed to delete" },
      { status: HttpStatusCode.BadRequest }
    );
  }
}
