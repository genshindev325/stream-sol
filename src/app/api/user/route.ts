import { NextResponse } from "next/server";
import UserModel from "@/models/user";
import { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";

export async function POST(request: Request) {
  const userPk = request.headers.get("user");

  const userData = await request.json();

  await connectMongo();

  const oldUser = await UserModel.findOne({
    $or: [{ publickey: userPk }, { username: userData.username }],
  });

  if (oldUser) {
    return NextResponse.json(
      { message: "User Already Registered" },
      { status: HttpStatusCode.Conflict }
    );
  }

  const newUser = new UserModel({
    ...userData,
    publickey: userPk,
  });

  await newUser.save();

  return NextResponse.json(
    { user: newUser },
    { status: HttpStatusCode.Created }
  );
}

export async function PUT(request: Request) {
  const userPk = request.headers.get("user");

  const userData = await request.json();

  await connectMongo();

  const user = await UserModel.findOneAndUpdate(
    {
      $or: [{ publickey: userPk }, { username: userData.username }],
    },
    {
      ...userData,
    }
  );

  if (!user) {
    return NextResponse.json(
      { message: "User Does Not Exist" },
      { status: HttpStatusCode.NotFound }
    );
  }

  const newUser = await UserModel.findOne({
    $or: [{ publickey: userPk }, { username: userData.username }],
  });

  return NextResponse.json({ user: newUser }, { status: HttpStatusCode.Ok });
}
