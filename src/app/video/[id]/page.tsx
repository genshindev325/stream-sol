"use server"; // This is a server component

import { redirect } from "next/navigation";
import { getVideoById } from "@/services/video";
import VideoPage from "@/components/video/VideoPage";

type Props = {
  params: { id: string };
};

export default async function RecordingVideo({ params }: Props) {
  const videoId = params.id;
  try {
    const { video } = await getVideoById({
      videoId,
    });
    return <VideoPage videoData={video} />;
  } catch (err) {
    redirect("/not-found");
  }
}
