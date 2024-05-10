import { type NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";
import UserModel from "@/models/user";

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

export async function POST(request: Request) {
  const userPk = request.headers.get("user");

  const userData = await request.json();

  await connectMongo();

  const oldUser = await UserModel.findOne({
    username: userData.username,
  });

  if (oldUser) {
    return NextResponse.json(
      { errors: "Duplicated username" },
      { status: HttpStatusCode.Conflict }
    );
  }

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
  } catch (errors: any) {
    return NextResponse.json({ errors }, { status: HttpStatusCode.BadRequest });
  }
}

export async function PUT(request: Request) {
  const userPk = request.headers.get("user");

  const userData = await request.json();

  await connectMongo();

  const oldUser = await UserModel.findOne({
    $and: [{ publickey: { $ne: userPk } }, { username: userData.username }],
  });

  if (oldUser) {
    return NextResponse.json(
      { errors: "Duplicated username" },
      { status: HttpStatusCode.Conflict }
    );
  }

  try {
    const user = await UserModel.findOneAndUpdate(
      { publickey: userPk },
      { ...userData },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: "User Does Not Exist" },
        { status: HttpStatusCode.NotFound }
      );
    }

    return NextResponse.json({ user }, { status: HttpStatusCode.Ok });
  } catch (errors: any) {
    return NextResponse.json({ errors }, { status: HttpStatusCode.BadRequest });
  }
}
