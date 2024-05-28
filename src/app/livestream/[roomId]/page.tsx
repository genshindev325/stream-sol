"use server"; // This is a server component

import { redirect } from "next/navigation";
import LiveStreamPage from "@/components/stream/LiveStreamPage";
import { getRoomAccessToken } from "@/services/room";
import { getLivestreamByRoomId, startRecording } from "@/services/livestream";

type Props = {
  params: { roomId: string };
};

export default async function Livestream({ params }: Props) {
  const roomId = params.roomId;

  try {
    const { livestream } = await getLivestreamByRoomId(roomId);
    return <LiveStreamPage livestreamData={livestream} />;
  } catch (err) {
    redirect("/not-found");
  }
}
