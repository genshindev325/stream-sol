import { NextResponse } from "next/server";
import connectMongo from "@/libs/connect-mongo";
import UserModel from "@/models/user";
import { HttpStatusCode } from "axios";

export async function POST(request: Request) {
  const userPk = request.headers.get("user");
  const userData = await request.json();

  if (userData.publicKey !== userPk) {
    return NextResponse.json(
      { message: "authentication failed" },
      { status: 401 }
    );
  }

  await connectMongo();

  const user = await UserModel.findOne({
    publickey: userPk,
  });

  return NextResponse.json({ user }, { status: HttpStatusCode.Ok });
}
