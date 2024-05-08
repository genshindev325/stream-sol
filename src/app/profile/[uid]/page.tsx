"use server"; // This is a server component

import { redirect } from "next/navigation";
import ProfilePage from "@/components/profile/ProfilePage";
import { getProfileByUsername } from "@/services/profile";

type Props = {
  params: { uid: string };
};

export default async function Video({ params }: Props) {
  const username = params.uid;

  try {
    const profile = await getProfileByUsername(username);
    return <ProfilePage profile={profile} />;
  } catch (err) {
    redirect("/not-found");
  }
}
