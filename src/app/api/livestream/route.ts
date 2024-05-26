import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/libs/connect-mongo";
import LivestreamModel from "@/models/livestream";
import { HttpStatusCode } from "axios";
import UserModel, { IUser } from "@/models/user";

export async function POST(request: Request) {
  const userPk = request.headers.get("user");
  const livestreamData = await request.json();

  await connectMongo();

  const creator = await UserModel.findOne({
    publickey: userPk,
  });
  const livestream = new LivestreamModel({
    creator,
    ...livestreamData,
  });

  console.log("MongoDB", livestream);

  try {
    await livestream.save();

    return NextResponse.json(
      { livestream },
      { status: HttpStatusCode.Created }
    );
  } catch (errors: any) {
    return NextResponse.json(
      { livestream },
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
