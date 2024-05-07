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

/// Utils
import { API_CONFIG } from "@/libs/constants";
import { getAccessToken, addressShow, formatK } from "@/libs/helpers";

export default function UserProfile({ params }: { params: { uid: string } }) {
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(true);
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const tab = searchParams.get("tab") || "";

  const [pk, setPk] = useState("");
  const [name, setName] = useState("");
  const [banner, setBanner] = useState("");
  const [avatar, setAvatar] = useState("");
  const [description, setDescription] = useState("");
  const username = params.uid;

  const [subscribers, setSubscribers] = useState(0);
  const [subscribed, setSubscribed] = useState(0);
  const { publicKey } = useWallet();
  const [followed, setFollowed] = useState(false);
  const router = useRouter();
  const [refetch, setRefetch] = useState(false);
  const [donated, setDonated] = useState(false);

  const doFollow = async () => {
    if (!publicKey) {
      toast.error("Connect your wallet", { duration: 3000 });
      return;
    }
    if (pk) {
      setLoading(true);
      try {
        const token = getAccessToken();
        await axios.post(
          `${API_CONFIG}/follow`,
          { follower: pk },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        setRefetch((prev) => !prev);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          toast.error("You must add your profile", { duration: 3000 });
        }
        console.error(err);
      }
      setLoading(false);
    }
  };

  const selectTab = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete("tab");
    params.set("tab", value);
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (username !== "") {
      setLoading(true);
      axios
        .get(`${API_CONFIG}/profile/username/${username}`)
        .then((res) => {
          const { user, success } = res.data;
          if (success) {
            setNotFound(false);
            setAvatar(user.avatar);
            setBanner(user.banner);
            setName(user.firstname + " " + user.lastname);
            setSubscribers(user.subscribers);
            setSubscribed(user.subscribed);
            setPk(user.publicKey);
            setDescription(user.description);
          }
        })
        .catch((err) => {})
        .finally(() => {
          setLoading(false);
        });
    }
    router.push("/not-found");
  }, [username]);

  useEffect(() => {
    if (pk && publicKey) {
      setLoading(true);
      const token = getAccessToken();
      axios
        .get(`${API_CONFIG}/profile/is-followed/${pk}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then(({ data }) => {
          if (data.followed) {
            setFollowed(true);
          } else {
            setFollowed(false);
          }
        })
        .catch((err) => {})
        .finally(() => {
          setLoading(false);
        });
    }
  }, [publicKey, pk, refetch]);

  useEffect(() => {
    if (tab !== "videos" && tab !== "announcements" && tab !== "subscribers") {
      selectTab("videos");
    }
  }, [tab]);

  return (
    <div className="relative w-full h-full mb-[32px] sm:mb-[48px]">
      {loading && <FullLoading />}
      {!loading && notFound ? (
        <div className="flex justify-center items-center w-full h-full text-[1.5rem] sm:text-[2rem]">
          Not Found
        </div>
      ) : (
        <div className="mx-auto flex-1 sm:w-[360px] lg:w-[600px] xl:w-[960px] 2xl:w-[1200px]">
          {banner === "" ? (
            <div className="w-full h-[90px] lg:h-[150px] xl:h-[240px] bg-profile rounded-lg"></div>
          ) : (
            <img
              src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${banner}`}
              className="w-full rounded-lg"
              crossOrigin="anonymous"
              alt="banner"
            />
          )}
          <div className="flex gap-[16px] pb-[32px]">
            <div className="flex justify-center items-center hover:cursor-pointer mt-[-12px] lg:mt-[-20px] ml-[12px] min-w-[64px] w-[64px] h-[64px] lg:min-w-[94px] lg:w-[94px] lg:h-[94px] border-2 border-grey-900 rounded-full bg-grey-900">
              {avatar === "" ? (
                <div className="relative min-w-[40px] w-[40px] h-[40px] lg:min-w-[60px] lg:w-[60px] lg:h-[60px] rounded-full">
                  <Image
                    src="/svgs/user.svg"
                    alt="user"
                    className="w-full h-full"
                    fill
                    priority={true}
                  />
                </div>
              ) : (
                <img
                  src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${avatar}`}
                  className="w-full h-full rounded-full"
                  crossOrigin="anonymous"
                  alt="Avatar"
                />
              )}
            </div>
            <div className="flex flex-col xl:flex-row xl:items-center gap-[16px] w-full text-grey-300">
              <div className="flex-1">
                <div className="text-[1rem] sm:text-[1.25rem] font-semibold">
                  {name}
                </div>
                <div className="text-[0.75rem] sm:text-[0.875rem] text-grey-500 font-light hover:cursor-pointer">
                  @{username}&nbsp;&nbsp;(
                  <span
                    className="text-[#a154ff]"
                    onClick={() => {
                      navigator.clipboard.writeText(pk);
                      toast.success("Copied", { duration: 3000 });
                    }}
                  >
                    {addressShow(pk)}
                  </span>
                  )
                </div>
                <div className="text-[0.75rem] sm:text-[0.875rem]">
                  {subscribers === 0 ? "No" : formatK(subscribers)} Subscribers
                  • {subscribed === 0 ? "No" : formatK(subscribed)} Subscribed
                </div>
                <div className="text-[0.75rem] sm:text-[0.875rem] break-words line-clamp-3 w-[240px] lg:w-[300px] xl:w-[400px]">
                  {description}
                </div>
              </div>
              <div className="flex gap-2 sm:gap-4">
                {pk !== publicKey?.toBase58() && (
                  <div
                    className="bg-white text-BG w-[120px] xl:w-[140px] h-[36px] xl:h-[48px] text-[0.875rem] lg:text-[1rem] rounded-lg flex justify-center items-center hover:cursor-pointer font-bold"
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
                    (followed
                      ? " bg-white text-primary-300"
                      : " bg-primary-300")
                  }
                  onClick={() => {
                    if (pk !== publicKey?.toBase58()) {
                      doFollow();
                    } else {
                      router.push("/edit-profile");
                    }
                  }}
                >
                  {pk !== publicKey?.toBase58() ? (
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
                (tab === "subscribers"
                  ? " text-white border-b border-white"
                  : " text-grey-500")
              }
              onClick={() => {
                selectTab("subscribers");
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
      )}

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
