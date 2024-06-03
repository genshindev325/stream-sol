import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/libs/connect-mongo";
import { HttpStatusCode } from "axios";
import LivestreamModel from "@/models/livestream";
import { ITEMS_PER_PAGE } from "@/libs/constants";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pubkey = searchParams.get("pubkey") as string;
  const pageStr = searchParams.get("pageNum") || "1";
  const page = Number(pageStr);

  if (Number.isNaN(page)) {
    throw new Error(`Invalid page number: ${pageStr}`);
  }

  try {
    await connectMongo();

    let query = {
      "creator.publickey": pubkey,
    };
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const videos = await LivestreamModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(ITEMS_PER_PAGE);

    const count = await LivestreamModel.countDocuments(query);

    return NextResponse.json({ videos, count }, { status: HttpStatusCode.Ok });
  } catch (err) {
    return NextResponse.json({}, { status: HttpStatusCode.BadRequest });
  }
}
