import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const userPk = req.headers.get("user");

  console.log(userPk)
  return NextResponse.json({ user: null }, { status: 200 })
}
