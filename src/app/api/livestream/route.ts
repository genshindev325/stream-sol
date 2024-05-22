import { NextResponse } from "next/server";
import connectMongo from "@/libs/connect-mongo";
import LivestreamModel from "@/models/livestream";
import { HttpStatusCode } from "axios";

export async function POST(request: Request) {
  const userPk = request.headers.get("user");
  const livestreamData = await request.json();

  await connectMongo();

  const livestream = new LivestreamModel({
    creator: userPk,
    ...livestreamData,
  });

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
