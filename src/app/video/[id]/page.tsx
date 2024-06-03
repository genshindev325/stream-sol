"use server"; // This is a server component

import type { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import { getVideoById } from "@/services/video";
import VideoPage from "@/components/video/VideoPage";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const videoId = params.id;

  let metadata = {};

  try {
    const data = await getVideoById({
      videoId,
    });

    const previousImages = (await parent).openGraph?.images || [];

    metadata = {
      title: data.video.title,
      description: data.video.description,
      openGraph: {
        type: "website",
        title: data.video.title,
        description: data.video.description,
        images: [
          `https://${data.video.thumbnail}.ipfs.dweb.link`,
          ...previousImages,
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: data.video.title,
        description: data.video.description,
        images: [
          `https://${data.video.thumbnail}.ipfs.dweb.link`,
          ...previousImages,
        ],
      },
    };
  } catch (err) {
    console.error(err);
  }
  return metadata;
}

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
