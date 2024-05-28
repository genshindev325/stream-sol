import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/libs/connect-mongo";
import { HttpStatusCode } from "axios";
import ArchievedstreamModel from "@/models/archievedstream";
import { ITEMS_PER_PAGE } from "@/libs/constants";
import mongoose from "mongoose";

export async function POST(request: Request) {
  const userPk = request.headers.get("user");
  const archievedstreamData = await request.json();

  await connectMongo();

  const archievedstream = new ArchievedstreamModel({
    ...archievedstreamData,
  });

  console.log("Archievedstream Data: ", archievedstream);

  try {
    await archievedstream.save();

    return NextResponse.json(
      { archievedstream },
      { status: HttpStatusCode.Created }
    );
  } catch (errors: any) {
    return NextResponse.json(
      { archievedstream },
      { status: HttpStatusCode.BadRequest }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const archievedstreamId = searchParams.get("archievedstreamId");

  await connectMongo();

  const archievedstream = await ArchievedstreamModel.findOne({
    _id: new mongoose.Types.ObjectId(archievedstreamId!),
  });

  if (!archievedstream) {
    return NextResponse.json(
      { message: "Archievedstream Does Not Exist" },
      { status: HttpStatusCode.NotFound }
    );
  }

  return NextResponse.json({ archievedstream }, { status: HttpStatusCode.Ok });
}
