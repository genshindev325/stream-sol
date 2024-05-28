"use server"; // This is a server component

import { redirect } from "next/navigation";
import ArchievedstreamPage from "@/components/archievedstream/archievedstreamPage";
import { getArchievedstreamById } from "@/services/archievedstream";

type Props = {
  params: { archievedstreamId: string };
};

export default async function RecordingVideo({ params }: Props) {
  const archievedstreamId = params.archievedstreamId;
  try {
    const { archievedstream } = await getArchievedstreamById({
      archievedstreamId,
    });
    return <ArchievedstreamPage archievedstreamData={archievedstream} />;
  } catch (err) {
    // redirect("/not-found");
  }
}
