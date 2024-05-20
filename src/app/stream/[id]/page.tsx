"use server"; // This is a server component

import { redirect } from "next/navigation";
import { getLiveStream } from "@/services/stream";
import LiveStreamPage from "@/components/stream/LiveStreamPage";

type Props = {
  params: { id: string };
};

export default async function LiveStream({ params }: Props) {
  const roomId = params.id;

  try {
    const stream = await getLiveStream(roomId);
    return <LiveStreamPage />;
  } catch (err) {
    redirect("/not-found");
  }
}
