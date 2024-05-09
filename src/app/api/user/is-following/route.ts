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
    // "user.publicKey": user,
    // "follower.publicKey": follower,

    "user.publickey": "FDRJMzFnamyAUdtUo4cipGQrrvoHe4ZZXQomk2E6uoAy",
    "follower.publickey": "BHpRVje4KuQxqaZvXvSyFXi6YKGh71EqSaekYBRfUV4rZ",
  });

  console.log(follow);

  if (!follow) {
    return NextResponse.json(
      { message: "User Does Not Have That Follower" },
      { status: HttpStatusCode.NotFound }
    );
  }

  return NextResponse.json({ isFollower: true }, { status: HttpStatusCode.Ok });
}
