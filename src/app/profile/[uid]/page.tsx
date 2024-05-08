"use client"; // This is a client component

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

/// React icons
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { RiUserAddLine } from "react-icons/ri";

/// Built-in Import
import axios from "axios";
import toast from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";

/// Custom Import
// import {
//   Videos,
//   Announcement,
//   Following,
//   DonateModal,
// } from "@/components/profile";
import { FullLoading } from "@/components/common";
import { addressShow, formatK } from "@/libs/helpers";
import { getProfileByUsername } from "@/services/profile";

/// Images
import userPic from "@/assets/svgs/user.svg";
import { User } from "@/libs/types";

export default function UserProfile({ params }: { params: { uid: string } }) {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "";
  const pathname = usePathname();
  const router = useRouter();
  const username = params.uid;

  const [profile, setProfile] = useState<User | null>();

  const { publicKey } = useWallet();
  const [followed, setFollowed] = useState(false);
  const [donated, setDonated] = useState(false);

  const selectTab = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete("tab");
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const doFollow = async () => {
    if (!publicKey) {
      toast.error("Connect your wallet", { duration: 3000 });
      return;
    }
    // if (pk) {
    //   setLoading(true);
    //   try {
    //     const token = getAccessToken();
    //     await axios.post(
    //       `${API_CONFIG}/follow`,
    //       { follower: pk },
    //       {
    //         headers: {
    //           Authorization: "Bearer " + token,
    //         },
    //       }
    //     );

    //     setRefetch((prev) => !prev);
    //   } catch (err: any) {
    //     if (err?.response?.status === 404) {
    //       toast.error("You must add your profile", { duration: 3000 });
    //     }
    //     console.error(err);
    //   }
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    if (username) {
      (async function () {
        setLoading(true);
        try {
          const _profile = await getProfileByUsername(username);
          setProfile(_profile);
        } catch (err) {
          router.push("/not-found");
        }
        setLoading(false);
      })();
    }
  }, [username]);

  // useEffect(() => {
  //   if (pk && publicKey) {
  //     setLoading(true);
  //     const token = getAccessToken();
  //     axios
  //       .get(`${API_CONFIG}/profile/is-followed/${pk}`, {
  //         headers: {
  //           Authorization: "Bearer " + token,
  //         },
  //       })
  //       .then(({ data }) => {
  //         if (data.followed) {
  //           setFollowed(true);
  //         } else {
  //           setFollowed(false);
  //         }
  //       })
  //       .catch((err) => {})
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }
  // }, [publicKey, pk, refetch]);

  // useEffect(() => {
  //   if (tab !== "videos" && tab !== "announcements" && tab !== "subscribers") {
  //     selectTab("videos");
  //   }
  // }, [tab]);

  return (
    <div className="relative w-full h-full mb-[32px] sm:mb-[48px]">
      {loading && <FullLoading />}

      <div className="mx-auto flex-1 sm:w-[360px] lg:w-[600px] xl:w-[960px] 2xl:w-[1200px]">
        {profile?.banner ? (
          <img
            src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${profile?.banner}`}
            className="w-full rounded-lg"
            crossOrigin="anonymous"
            alt="Banner"
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
                {(profile?.firstname || "") + " " + (profile?.lastname || "")}
              </div>
              <div className="text-[0.75rem] sm:text-[0.875rem] text-grey-500 font-light hover:cursor-pointer">
                @{profile?.username || ""}&nbsp;&nbsp;(
                <span
                  className="text-[#a154ff]"
                  onClick={() => {
                    navigator.clipboard.writeText(profile?.publickey || "");
                    toast.success("Copied", { duration: 3000 });
                  }}
                >
                  {addressShow(profile?.publickey || "")}
                </span>
                )
              </div>
              <div className="text-[0.75rem] sm:text-[0.875rem]">
                {(profile?.followers || 0) === 0
                  ? "No"
                  : formatK(profile?.followers || 0)}{" "}
                Followers •{" "}
                {(profile?.following || 0) === 0
                  ? "No"
                  : formatK(profile?.following || 0)}{" "}
                Following
              </div>
              <div className="text-[0.75rem] sm:text-[0.875rem] break-words line-clamp-3 w-[240px] lg:w-[300px] xl:w-[400px]">
                {profile?.description || ""}
              </div>
            </div>
            <div className="flex gap-2 sm:gap-4">
              {profile?.publickey !== publicKey?.toBase58() && (
                <div
                  className="bg-white text-background w-[120px] xl:w-[140px] h-[36px] xl:h-[48px] text-[0.875rem] lg:text-[1rem] rounded-lg flex justify-center items-center hover:cursor-pointer font-bold"
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
                  "w-[120px] xl:w-[160px] h-[36px] xl:h-[48px] text-[0.875rem] lg:text-[1rem] rounded-lg flex justify-center items-center hover:cursor-pointer font-semibold" +
                  (followed ? " bg-white text-primary-300" : " bg-primary-300")
                }
                onClick={() => {
                  if (profile?.publickey !== publicKey?.toBase58()) {
                    doFollow();
                  } else {
                    router.push("/profile");
                  }
                }}
              >
                {profile?.publickey !== publicKey?.toBase58() ? (
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
              (tab === "videos"
                ? " text-white border-b border-white"
                : " text-grey-500")
            }
            onClick={() => {
              // selectTab("videos");
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
              // selectTab("announcements");
            }}
          >
            Announcements
          </div>
          <div
            className={
              "text-center py-2 hover:cursor-pointer font-semibold" +
              (tab === "subscribers"
                ? " text-white border-b border-white"
                : " text-grey-500")
            }
            onClick={() => {
              // selectTab("subscribers");
            }}
          >
            Subscribers
          </div>
        </div>
        {/* {pk &&
            (tab === "subscribers" ? (
              <Following profilePk={pk} />
            ) : tab === "announcements" ? (
              <Announcement pk={pk} name={name} />
            ) : (
              <Videos pk={pk} />
            ))} */}
      </div>

      {/* {donated && (
        <DonateModal
          pk={pk}
          name={name}
          username={username}
          avatar={avatar}
          onClose={() => {
            setDonated(false);
          }}
        />
      )} */}
    </div>
  );
}
