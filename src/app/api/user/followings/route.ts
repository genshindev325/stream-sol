import { type NextRequest, NextResponse } from "next/server";
import FollowModel from "@/models/follow";
import { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";
import { ITEMS_PER_PAGE } from "@/libs/constants";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const profileUser = searchParams.get("user");
  const page = searchParams.get("page");

  await connectMongo();

  const totalCount = await FollowModel.countDocuments({
    "follower.publickey": profileUser,
  });

  const followings = await FollowModel.find({
    "follower.publickey": profileUser,
  })
    .select("user")
    .skip((Number(page) - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);

  return NextResponse.json(
    { followings, count: totalCount },
    { status: HttpStatusCode.Ok }
  );
}
