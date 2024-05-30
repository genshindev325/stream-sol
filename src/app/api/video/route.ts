import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";
import VideoModel from "@/models/video";
import UserModel from "@/models/user";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("videoId") as string;

  try {
    await connectMongo();

    const video = await VideoModel.findOne({
      _id: new mongoose.Types.ObjectId(videoId),
    });

    if (!video) {
      return NextResponse.json({}, { status: HttpStatusCode.NotFound });
    }

    const user = await UserModel.findOne({
      publickey: video.creator,
    });

    if (!user) {
      return NextResponse.json({}, { status: HttpStatusCode.NotFound });
    }

    return NextResponse.json({ video, user }, { status: HttpStatusCode.Ok });
  } catch (err) {
    return NextResponse.json({}, { status: HttpStatusCode.BadRequest });
  }
}
