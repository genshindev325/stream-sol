import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/libs/connect-mongo";
import { HttpStatusCode } from "axios";
import ArchievedstreamModel from "@/models/archievedstream";
import { ITEMS_PER_PAGE } from "@/libs/constants";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("pageNum") || "1", 10);
  const publicKey = searchParams.get("publicKey");

  await connectMongo();

  let query = { creator: publicKey };
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const archievedstreams = await ArchievedstreamModel.find(query)
    .skip(skip)
    .limit(ITEMS_PER_PAGE);

  const allArchievedstreams = await ArchievedstreamModel.find({});

  if (!archievedstreams.length) {
    return NextResponse.json(
      { message: "Archievedstreams Does Not Exist" },
      { status: HttpStatusCode.NotFound }
    );
  }

  return NextResponse.json(
    { archievedstreams, count: allArchievedstreams.length },
    { status: HttpStatusCode.Ok }
  );
}
