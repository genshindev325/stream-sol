import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/libs/connect-mongo";
import LivestreamModel from "@/models/livestream";
import { HttpStatusCode } from "axios";

export async function PUT(request: NextRequest) {
  try {
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

    const result = await LivestreamModel.updateOne(
      { roomId },
      { $inc: { views: 1 } }
    );

    console.log("MongoDB", livestream);

    return NextResponse.json(
      { livestream: result },
      { status: HttpStatusCode.Ok }
    );
  } catch (errors: any) {
    return NextResponse.json({ status: HttpStatusCode.NotModified });
  }
}
