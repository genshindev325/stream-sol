"use server"; // This is a server component

import { redirect } from "next/navigation";
import LiveStreamPage from "@/components/stream/LiveStreamPage";
import { getRoomAccessToken } from "@/services/room";

type Props = {
  params: { roomId: string };
};

export default async function Livestream({ params }: Props) {
  const roomId = params.roomId;
  const roomAccessToken = await getRoomAccessToken({ roomId });

  try {
    return <LiveStreamPage token={roomAccessToken || ""} />;
  } catch (err) {
    redirect("/not-found");
  }
}
