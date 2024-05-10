import { type NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";
import UserModel from "@/models/user";
import AnnouncementModel from "@/models/announcement";
import AlikeModel from "@/models/alike";
import { ITEMS_PER_PAGE } from "@/libs/constants";
import { AlikeEnum } from "@/libs/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const publicKey = searchParams.get("publicKey");
  const user = searchParams.get("user");
  const page = Number(searchParams.get("page"));

  await connectMongo();

  const count = await AnnouncementModel.countDocuments({
    user,
  });

  const announcements = await AnnouncementModel.find({
    user,
  })
    .sort({ createdAt: -1 })
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);

  const likes = await AlikeModel.find({
    announcement: { $in: announcements.map((value) => value._id) },
    user: publicKey,
  });

  const data = [];
  for (let i = 0; i < announcements.length; i++) {
    const aid = announcements[i]._id;
    const like = likes.find((val) => val.announcement.equals(aid));

    if (like) {
      data.push({
        ...announcements[i].toObject(),
        userLiked: like.liked ? AlikeEnum.Like : AlikeEnum.Dislike,
      });
    } else {
      data.push({
        ...announcements[i].toObject(),
        userLiked: AlikeEnum.None,
      });
    }
  }

  return NextResponse.json(
    { announcements: data, count },
    { status: HttpStatusCode.Ok }
  );
}

export async function POST(request: Request) {
  const userPk = request.headers.get("user");

  const userData = await request.json();

  await connectMongo();

  const { content } = userData;

  const user = await UserModel.findOne({ publickey: userPk });

  if (!user) {
    return NextResponse.json(
      { message: "User Does Not Exist" },
      { status: HttpStatusCode.NotFound }
    );
  }

  const announcement = new AnnouncementModel({
    user: userPk,
    content,
  });

  try {
    await announcement.save();

    return NextResponse.json(
      { announcement },
      { status: HttpStatusCode.Created }
    );
  } catch (errors: any) {
    return NextResponse.json({ errors }, { status: HttpStatusCode.BadRequest });
  }
}
