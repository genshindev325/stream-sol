import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/libs/connect-mongo";
import ChatModel from "@/models/chat";
import { HttpStatusCode } from "axios";
import LivestreamModel from "@/models/livestream";

export async function POST(request: Request) {
  try {
    await connectMongo();

    const chatData = await request.json();

    console.log("Chat data: ", chatData);

    const livestream = await LivestreamModel.find({
      roomId: chatData.roomId,
    });

    const objectId = livestream[0]._id?.toString();
    const newChat = new ChatModel({
      livestreamId: objectId,
      ...chatData,
    });

    await newChat.save();

    return NextResponse.json(
      { chat: newChat },
      { status: HttpStatusCode.Created }
    );
  } catch (errors: any) {
    return NextResponse.json({ errors }, { status: HttpStatusCode.BadRequest });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const livestreamId = searchParams.get("livestreamId");

    await connectMongo();

    const chatHistory = await ChatModel.find({
      livestreamId,
    }).sort({ createdAt: 1 });

    return NextResponse.json({ chatHistory }, { status: HttpStatusCode.Ok });
  } catch (errors: any) {
    return NextResponse.json({ errors }, { status: HttpStatusCode.BadRequest });
  }
}
