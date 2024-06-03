import { type NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";
import LivestreamModel from "@/models/livestream";
import SlikeModel from "@/models/slike";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id") as string;
  const pubkey = searchParams.get("pubkey") as string;

  await connectMongo();

  const slike = await SlikeModel.findOne({
    livestreamId: new mongoose.Types.ObjectId(id),
    user: pubkey,
  });

  if (!slike) {
    return NextResponse.json(
      { statue: "none" },
      { status: HttpStatusCode.NotFound }
    );
  }

  return NextResponse.json(
    { status: slike.liked ? "like" : "dislike" },
    { status: HttpStatusCode.Ok }
  );
}

export async function POST(request: NextRequest) {
  const userPk = request.headers.get("user");
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id") as string;
  const liked = searchParams.get("liked") === "true";

  try {
    await connectMongo();

    const stream = await LivestreamModel.findById(id);

    if (!stream) {
      return NextResponse.json({}, { status: HttpStatusCode.NotFound });
    }

    const slike = await SlikeModel.findOne({
      livestreamId: stream.id,
      user: userPk,
    });

    let newLiked = "";

    if (slike) {
      if (slike.liked === liked) {
        await SlikeModel.deleteOne({
          livestreamId: stream.id,
          user: userPk,
        });
        if (liked) {
          stream.likes -= 1;
        } else {
          stream.dislikes -= 1;
        }
      } else {
        slike.liked = liked;
        newLiked = liked ? "like" : "dislike";
        await slike.save();

        if (liked) {
          stream.likes += 1;
          stream.dislikes -= 1;
        } else {
          stream.dislikes += 1;
          stream.likes -= 1;
        }
      }
    } else {
      const newSlike = new SlikeModel({
        livestreamId: stream.id,
        user: userPk,
        liked,
      });
      newLiked = liked ? "like" : "dislike";
      await newSlike.save();

      if (liked) {
        stream.likes += 1;
      } else {
        stream.dislikes += 1;
      }
    }

    await stream.save();
    return NextResponse.json(
      { like: newLiked, livestream: stream },
      { status: HttpStatusCode.Created }
    );
  } catch (errors: any) {
    return NextResponse.json({ errors }, { status: HttpStatusCode.BadRequest });
  }
}
