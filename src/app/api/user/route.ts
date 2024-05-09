import { NextResponse } from "next/server";
import UserModel from "@/models/user";
import { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";

export async function POST(request: Request) {
  const userPk = request.headers.get("user");

  const userData = await request.json();

  await connectMongo();

  const newUser = new UserModel({
    ...userData,
    publickey: userPk,
  });

  try {
    await newUser.save();

    return NextResponse.json(
      { user: newUser },
      { status: HttpStatusCode.Created }
    );
  } catch (err: any) {
    return NextResponse.json(
      { errors: err?.errors },
      { status: HttpStatusCode.BadRequest }
    );
  }
}

export async function PUT(request: Request) {
  const userPk = request.headers.get("user");

  const userData = await request.json();

  await connectMongo();

  try {
    const user = await UserModel.findOneAndUpdate(
      { publickey: userPk },
      { ...userData },
      { runValidators: true, context: "query", new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: "User Does Not Exist" },
        { status: HttpStatusCode.NotFound }
      );
    }

    return NextResponse.json({ user }, { status: HttpStatusCode.Ok });
  } catch (err: any) {
    return NextResponse.json(
      { errors: err?.errors },
      { status: HttpStatusCode.BadRequest }
    );
  }
}
