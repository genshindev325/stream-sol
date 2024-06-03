import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";
import LivestreamModel from "@/models/livestream";

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const roomId = searchParams.get("roomId") as string;
  const inc = searchParams.get("inc") as string;

  try {
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
