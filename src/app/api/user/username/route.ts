import { type NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user";
import { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  await connectMongo();

  const user = await UserModel.findOne({
    username,
  });

  if (!user) {
    return NextResponse.json(
      { message: "User Does Not Exist" },
      { status: HttpStatusCode.NotFound }
    );
  }

  return NextResponse.json({ user }, { status: HttpStatusCode.Ok });
}