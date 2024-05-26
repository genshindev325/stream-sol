import Livestream from "@/app/livestream/[roomId]/page";
import connectMongo from "@/libs/connect-mongo";
import { ITEMS_PER_PAGE } from "@/libs/constants";
import LivestreamModel from "@/models/livestream";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search");

    await connectMongo();

    let query = { title: { $regex: `.*${search}.*`, $options: "i" } };
    const skip = (page - 1) * ITEMS_PER_PAGE;
  
    const livestreams = (await LivestreamModel.find(query).skip(skip).limit(ITEMS_PER_PAGE));

    const allLivestreams = await LivestreamModel.find({});
  
    if (!livestreams) {
      return NextResponse.json(
        { message: "Livestream Does Not Exist" },
        { status: HttpStatusCode.NotFound }
      );
    }
  
    return NextResponse.json({ livestreams, count: allLivestreams.length }, { status: HttpStatusCode.Ok });
  }