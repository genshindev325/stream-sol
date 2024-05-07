import { type NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user";
import { HttpStatusCode } from "axios";
import connectMongo from "@/libs/connect-mongo";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug: string = params.slug;
  const searchParams = request.nextUrl.searchParams;
  const publicKey = searchParams.get("publicKey");

  await connectMongo();

  const user = await UserModel.findOne({
    $and: [{ publickey: { $ne: publicKey } }, { username: slug }],
  });

  if (user) {
    return NextResponse.json(
      { message: "Username Already Used" },
      { status: HttpStatusCode.Conflict }
    );
  }

  return NextResponse.json({ unique: true }, { status: HttpStatusCode.Ok });
}
