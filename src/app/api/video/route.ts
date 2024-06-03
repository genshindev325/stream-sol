import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";
import LivestreamModel from "@/models/livestream";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("videoId") as string;

  try {
    await connectMongo();

    const video = await LivestreamModel.findOne({
      _id: new mongoose.Types.ObjectId(videoId),
      archived: true,
    });

    if (!video) {
      return NextResponse.json({}, { status: HttpStatusCode.NotFound });
    }

    return NextResponse.json({ video }, { status: HttpStatusCode.Ok });
  } catch (err) {
    return NextResponse.json({}, { status: HttpStatusCode.BadRequest });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("videoId") as string;

  try {
    await connectMongo();

    const video = await LivestreamModel.findByIdAndDelete(videoId);

    if (!video) {
      return NextResponse.json({}, { status: HttpStatusCode.NotFound });
    }

    return NextResponse.json({ video }, { status: HttpStatusCode.Ok });
  } catch (err) {
    return NextResponse.json({}, { status: HttpStatusCode.BadRequest });
  }
}
