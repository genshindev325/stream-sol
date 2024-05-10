import { type NextRequest, NextResponse } from "next/server";
import FollowModel from "@/models/follow";
import { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";
import { ITEMS_PER_PAGE } from "@/libs/constants";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const publicKey = searchParams.get("publicKey");
  const profileUser = searchParams.get("user");
  const page = searchParams.get("page");

  await connectMongo();

  const totalCount = await FollowModel.countDocuments({
    "user.publickey": profileUser,
  });

  const followers = await FollowModel.find({
    "user.publickey": profileUser,
  })
    .skip((Number(page) - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);

  const followings = await FollowModel.find({
    "follower.publickey": publicKey,
  });

  const data = [];

  for (let i = 0; i < followers.length; i++) {
    const temp = followings.findIndex((value) => {
      return value.user.publickey === followers[i].follower.publickey;
    });

    if (temp !== -1) {
      data.push({ user: followers[i].follower, followed: true });
    } else {
      data.push({ user: followers[i].follower, followed: false });
    }
  }
  return NextResponse.json(
    { followers: data, count: totalCount },
    { status: HttpStatusCode.Ok }
  );
}
