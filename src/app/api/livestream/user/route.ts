import connectMongo from "@/libs/connect-mongo";
import { ITEMS_PER_PAGE } from "@/libs/constants";
import LivestreamModel from "@/models/livestream";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const pubkey = searchParams.get("pubkey") as string;

  await connectMongo();

  const streams = await LivestreamModel.find({
    "creator.publickey": pubkey,
    archived: false,
  }).sort({ createdAt: -1 });

  return NextResponse.json({ streams }, { status: HttpStatusCode.Ok });
}
