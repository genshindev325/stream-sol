import { type NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";
import AnnouncementModel from "@/models/announcement";
import AlikeModel from "@/models/alike";

export async function POST(request: NextRequest) {
  const userPk = request.headers.get("user");

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  const liked = searchParams.get("liked") === "true";

  await connectMongo();

  const announcement = await AnnouncementModel.findById(id);

  if (!announcement) {
    return NextResponse.json(
      { message: "Announcement Does Not Exist" },
      { status: HttpStatusCode.NotFound }
    );
  }

  try {
    const alike = await AlikeModel.findOne({
      announcement: announcement._id,
      user: userPk,
    });

    if (alike) {
      if (alike.liked === liked) {
        await AlikeModel.deleteOne({
          announcement: announcement._id,
          user: userPk,
        });
        if (liked) {
          announcement.likes -= 1;
        } else {
          announcement.dislikes -= 1;
        }
      } else {
        alike.liked = liked;
        await alike.save();

        if (liked) {
          announcement.likes += 1;
          announcement.dislikes -= 1;
        } else {
          announcement.dislikes += 1;
          announcement.likes -= 1;
        }
      }
    } else {
      const newAlike = new AlikeModel({
        announcement: announcement._id,
        user: userPk,
        liked,
      });

      await newAlike.save();

      if (liked) {
        announcement.likes += 1;
      } else {
        announcement.dislikes += 1;
      }
    }

    await announcement.save();
    return NextResponse.json(
      { success: true },
      { status: HttpStatusCode.Created }
    );
  } catch (errors: any) {
    console.log(errors);
    return NextResponse.json({ errors }, { status: HttpStatusCode.BadRequest });
  }
}