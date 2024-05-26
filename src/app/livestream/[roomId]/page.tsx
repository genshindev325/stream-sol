"use server"; // This is a server component

import { redirect } from "next/navigation";
import LiveStreamPage from "@/components/stream/LiveStreamPage";

type Props = {
  params: { roomId: string };
};

export default async function Livestream({ params }: Props) {
  try {
    return <LiveStreamPage />;
  } catch (err) {
    redirect("/not-found");
  }
}
