import { NextResponse } from "next/server";
import connectMongo from "@/libs/connect-mongo";
import UserModel from "@/models/user";

export async function POST(req: Request) {
  const userPk = req.headers.get("user");

  await connectMongo();

  console.log(userPk)

  const oldUser = await UserModel.findOne({
    publickey: userPk,
  });

  console.log(userPk)

  return NextResponse.json({ user: oldUser }, { status: 200 });
}
