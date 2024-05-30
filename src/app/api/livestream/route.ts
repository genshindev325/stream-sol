import { NextRequest, NextResponse } from "next/server";
import axios, { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";
import UserModel from "@/models/user";
import { HUDDLE_API_KEY } from "@/libs/constants";
import LivestreamModel from "@/models/livestream";
import ArchievedstreamModel from "@/models/archievedstream";

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
  const video = searchParams.get("video");

  try {
    await connectMongo();

    const livestream = await LivestreamModel.findOneAndDelete({
      roomId,
    });

    if (!livestream) {
      return NextResponse.json(
        { message: "Livestream Does Not Exist" },
        { status: HttpStatusCode.NotFound }
      );
    }

    const archievedstream = new ArchievedstreamModel({
      title: livestream.title,
      description: livestream?.description!,
      thumbnail: livestream.thumbnail,
      roomId: livestream.roomId,
      creator: livestream.creator.publickey,
      video,
    });

    await archievedstream.save();

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

    let views = livestream.views - 1;
    if (inc === "1") {
      views = livestream.views + 1;
    }

    if (views >= 0) {
      livestream.views = views;
      await livestream.save();
    }

    return NextResponse.json({ livestream }, { status: HttpStatusCode.Ok });
  } catch (errors: any) {
    return NextResponse.json({ status: HttpStatusCode.NotModified });
  }
}
