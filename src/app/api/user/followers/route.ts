import { type NextRequest, NextResponse } from "next/server";
import FollowModel from "@/models/follow";
import { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const profileUser = searchParams.get("user");
  const publicKey = searchParams.get("publicKey");
  const page = searchParams.get("page");

  await connectMongo();

  const follow = await FollowModel.findOne({});

  if (!follow) {
    return NextResponse.json(
      { message: "User Does Not Have That Follower" },
      { status: HttpStatusCode.NotFound }
    );
  }

  return NextResponse.json({ isFollower: true }, { status: HttpStatusCode.Ok });
}
