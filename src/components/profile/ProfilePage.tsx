"use client"; // This is a client component

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

/// React icons
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { RiUserAddLine } from "react-icons/ri";

/// Built-in Import
import toast from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";

/// Custom Import
import { Videos, LiveBroadcast, Announcement, Followers } from ".";
import { FullLoading, DonateModal } from "@/components/common";
import { addressShow, formatK } from "@/libs/helpers";
import { isFollower, follow } from "@/services/profile";
import { User } from "@/libs/types";

/// Images
import userPic from "@/assets/svgs/user.svg";

type Props = {
  profile: User;
};

export default function ProfilePage({ profile }: Props) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") as string;
  const pathname = usePathname();
  const router = useRouter();
  const { publicKey } = useWallet();

  const [loading, setLoading] = useState<boolean>(false);
  const [followed, setFollowed] = useState<boolean>(false);
  const [donated, setDonated] = useState<boolean>(false);

  const selectTab = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete("tab");
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const Tab = () => {
    if (tab === "stream") {
      return <LiveBroadcast profile={profile} />;
    } else if (tab === "announcements") {
      return <Announcement profile={profile} />;
    } else if (tab === "followers") {
      return <Followers profile={profile} />;
    }
    return <Videos profile={profile} />;
  };

  const doFollow = async () => {
    if (!publicKey) {
      toast.error("Connect your wallet", { duration: 3000 });
      return;
    }
    setLoading(true);
    try {
      const data = await follow(profile.publickey);
      setFollowed(data.follow);
    } catch (err: any) {
      toast.error(`Failed to ${followed ? "Unfollow" : "Follow"}`, {
        duration: 3000,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (publicKey) {
      (async function () {
        setLoading(true);
        try {
          const _followed = await isFollower(
            profile.publickey,
            publicKey.toBase58()
          );
          setFollowed(_followed);
        } catch (err) {}
        setLoading(false);
      })();
    }
  }, [publicKey]);

  useEffect(() => {
    if (
      tab !== "stream" &&
      tab !== "videos" &&
      tab !== "announcements" &&
      tab !== "followers"
    ) {
      selectTab("stream");
    }
  }, [tab]);

  if (loading) {
    return <FullLoading />;
  }

  return (
    <div className="relative w-full h-full mb-[32px] sm:mb-[48px]">
      <div className="mx-[16px] sm:mx-auto flex-1 sm:w-[360px] lg:w-[600px] xl:w-[960px] 2xl:w-[1200px]">
        {profile?.banner ? (
          <img
            src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${profile?.banner}`}
            className="w-full rounded-lg"
            crossOrigin="anonymous"
            alt="Banner"
            fetchPriority="high"
          />
        ) : (
          <div className="w-full h-[90px] lg:h-[150px] xl:h-[240px] bg-profile rounded-lg"></div>
        )}
        <div className="flex gap-[16px] pb-[32px]">
          <div className="flex justify-center items-center hover:cursor-pointer mt-[-12px] lg:mt-[-20px] ml-[12px] min-w-[64px] w-[64px] h-[64px] lg:min-w-[94px] lg:w-[94px] lg:h-[94px] border-2 border-grey-900 rounded-full bg-grey-900">
            {profile?.avatar ? (
              <img
                src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${profile?.avatar}`}
                className="w-full h-full rounded-full"
                crossOrigin="anonymous"
                alt="Avatar"
              />
            ) : (
              <div className="bg-grey-900 w-full h-full rounded-full flex justify-center items-center hover:cursor-pointer">
                <div className="relative w-[36px] h-[36px] lg:w-[56px] lg:h-[56px]">
                  <Image src={userPic} alt="User" fill />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col xl:flex-row xl:items-center gap-[16px] w-full text-grey-300">
            <div className="flex-1">
              <div className="text-[1rem] sm:text-[1.25rem] font-semibold">
                {profile.fullname}
              </div>
              <div className="text-[0.75rem] sm:text-[0.875rem] text-grey-500 font-light hover:cursor-pointer">
                @{profile.username}&nbsp;&nbsp;(
                <span
                  className="text-[#a154ff]"
                  onClick={() => {
                    navigator.clipboard.writeText(profile.publickey);
                    toast.success("Copied", { duration: 3000 });
                  }}
                >
                  {addressShow(profile.publickey)}
                </span>
                )
              </div>
              <div className="text-[0.75rem] sm:text-[0.875rem]">
                {profile.followers === 0 ? "No" : formatK(profile.followers)}{" "}
                Followers •{" "}
                {profile.followings === 0 ? "No" : formatK(profile.followings)}{" "}
                Following
              </div>
              <div className="text-[0.75rem] sm:text-[0.875rem] break-words line-clamp-3 w-[240px] lg:w-[300px] xl:w-[400px]">
                {profile?.description || ""}
              </div>
            </div>
            <div className="flex gap-2 sm:gap-4">
              {profile.publickey !== publicKey?.toBase58() && (
                <div
                  className="bg-white text-background w-[120px] xl:w-[140px] h-[36px] xl:h-[48px] text-[0.875rem] lg:text-[1.125rem] rounded-lg flex justify-center items-center hover:cursor-pointer font-bold"
                  onClick={() => {
                    if (!publicKey) {
                      toast.error("Connect your wallet", {
                        duration: 3000,
                      });
                      return;
                    }
                    setDonated(true);
                  }}
                >
                  <AiOutlineDollarCircle className="text-[14px] lg:text-[18px] mr-1 lg:mr-2" />
                  Donate
                </div>
              )}
              <div
                className={
                  "w-[120px] xl:w-[160px] h-[36px] xl:h-[48px] text-[0.875rem] lg:text-[1.125rem] rounded-lg flex justify-center items-center hover:cursor-pointer font-bold" +
                  (followed ? " bg-white text-primary-300" : " bg-primary-300")
                }
                onClick={() => {
                  if (profile.publickey !== publicKey?.toBase58()) {
                    doFollow();
                  } else {
                    router.push("/profile");
                  }
                }}
              >
                {profile.publickey !== publicKey?.toBase58() ? (
                  <>
                    <RiUserAddLine className="text-[14px] lg:text-[18px] mr-1 lg:mr-2" />{" "}
                    {followed ? "Unfollow" : "Follow"}
                  </>
                ) : (
                  <>
                    <FaRegEdit className="text-[14px] lg:text-[18px] mr-1 lg:mr-2" />{" "}
                    Edit
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center sm:justify-start gap-4 sm:gap-6 w-full border-b border-[#FFFFFF0D] mb-4">
          <div
            className={
              "text-center py-2 hover:cursor-pointer font-semibold" +
              (tab === "stream"
                ? " text-white border-b border-white"
                : " text-grey-500")
            }
            onClick={() => {
              selectTab("stream");
            }}
          >
            Live
          </div>
          <div
            className={
              "text-center py-2 hover:cursor-pointer font-semibold" +
              (tab === "videos"
                ? " text-white border-b border-white"
                : " text-grey-500") 
            }
            onClick={() => {
              selectTab("videos");
            }}
          >
            Videos
          </div>
          <div
            className={
              "text-center py-2 hover:cursor-pointer font-semibold" +
              (tab === "announcements"
                ? " text-white border-b border-white"
                : " text-grey-500")
            }
            onClick={() => {
              selectTab("announcements");
            }}
          >
            Announcements
          </div>
          <div
            className={
              "text-center py-2 hover:cursor-pointer font-semibold" +
              (tab === "followers"
                ? " text-white border-b border-white"
                : " text-grey-500")
            }
            onClick={() => {
              selectTab("followers");
            }}
          >
            Followers
          </div>
        </div>
        {Tab()}
      </div>

      {donated && (
        <DonateModal
          pk={profile.publickey}
          name={profile.fullname}
          username={profile.username}
          avatar={profile.avatar!}
          onClose={() => {
            setDonated(false);
          }}
        />
      )}
    </div>
  );
}
