import { type NextRequest, NextResponse } from "next/server";
import FollowModel from "@/models/follow";
import { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user = searchParams.get("user");
  const follower = searchParams.get("follower");

  await connectMongo();

  const follow = await FollowModel.findOne({
    "user.publickey": user,
    "follower.publickey": follower,
  });

  if (!follow) {
    return NextResponse.json(
      { isFollower: false },
      { status: HttpStatusCode.Ok }
    );
  }

  return NextResponse.json({ isFollower: true }, { status: HttpStatusCode.Ok });
}
