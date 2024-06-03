"use client"; // This is a client component

import { useEffect, useState } from "react";

// Icons
import { FaDollarSign } from "react-icons/fa";
import { BiLike, BiDislike } from "react-icons/bi";

// Built-in
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

// Custom
import { Livestream } from "@/libs/types";
import { AvatarComponent, DonateModal, FullLoading } from "../common";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import {
  doLikeLivestream,
  doDislikeLivestream,
  getLikeStatus,
} from "@/services/livestream";
import { follow, isFollower } from "@/services/profile";

type Props = {
  videoData: Livestream;
};

export default function VideoPage({ videoData }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuthContext();
  const [donated, setDonated] = useState<boolean>(false);
  const [followed, setFollowed] = useState<boolean>(false);
  const { publicKey } = useWallet();

  const [liked, setLiked] = useState("");
  const [likes, setLikes] = useState(videoData.likes);
  const [dislikes, setDislikes] = useState(videoData.dislikes);

  useEffect(() => {
    if (publicKey) {
      (async function () {
        setLoading(true);
        try {
          const _followed = await isFollower(
            videoData.creator.publickey,
            publicKey.toBase58()
          );
          const { status } = await getLikeStatus(
            videoData.id,
            publicKey.toBase58()
          );
          setLiked(status);
          setFollowed(_followed);
        } catch (err) {}
        setLoading(false);
      })();
    }
  }, [publicKey]);

  const doLike = async () => {
    if (!publicKey) {
      toast.error("Connect your wallet", { duration: 3000 });
      return;
    }
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const { like, livestream } = await doLikeLivestream(videoData.id);
      setLiked(like);
      setLikes(livestream.likes);
      setDislikes(livestream.dislikes);
    } catch (err) {}
    setLoading(false);
  };

  const doDislike = async () => {
    if (!publicKey) {
      toast.error("Connect your wallet", { duration: 3000 });
      return;
    }
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const { like, livestream } = await doDislikeLivestream(videoData.id);
      setLiked(like);
      setLikes(livestream.likes);
      setDislikes(livestream.dislikes);
    } catch (err) {}
    setLoading(false);
  };

  const doFollow = async () => {
    if (!user) {
      toast.error("Connect your wallet", { duration: 3000 });
      return;
    }
    setLoading(true);
    try {
      const data = await follow(videoData.creator.publickey);
      setFollowed(data.follow);
    } catch (err: any) {
      toast.error(`Failed to ${followed ? "Unfollow" : "Follow"}`, {
        duration: 3000,
      });
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <FullLoading />}
      <div className="flex flex-1 flex-col p-[12px] sm:p-[16px]">
        <div className="flex max-xl:flex-col gap-[16px] mx-auto mb-[32px] sm:mb-[48px]">
          <div className="flex flex-col grow gap-[16px] m-[10px]">
            <div className="mx-auto relative">
              <video
                src={videoData.video}
                className="aspect-video rounded-xl lg:w-[800px]"
                playsInline
                controls
              />
            </div>

            <div className="text-[1.25rem] sm:text-[1.5rem] break- font-semibold">
              {videoData.title}
            </div>
            <div className="flex flex-col lg:flex-row justify-between gap-4 mt-4">
              <div className="flex gap-2 hover:cursor-pointer">
                <AvatarComponent avatar={videoData.creator?.avatar} size={44} />
                <div className="flex flex-col">
                  <div className="text-[0.875rem] sm:text-[1rem] text-grey-300">
                    {videoData.creator.username}
                  </div>
                </div>
              </div>
              {user?.publickey !== videoData.creator.publickey && (
                <div className="flex flex-col lg:flex-row items-end lg:items-center gap-4">
                  <div className="flex rounded-lg border border-grey-800 h-[36px] sm:h-[44px] w-[160px] text-[0.875rem] sm:text-[1rem] ">
                    <div
                      className={
                        "flex items-center justify-center gap-[8px] w-[80px] border-r border-grey-800 hover:cursor-pointer" +
                        (liked === "like"
                          ? " text-primary-300"
                          : " text-grey-300")
                      }
                      onClick={doLike}
                    >
                      <BiLike
                        size={18}
                        color={liked === "like" ? "#A154FF" : ""}
                      />
                      {likes}
                    </div>
                    <div
                      className={
                        "flex items-center justify-center gap-[8px] w-[80px] hover:cursor-pointer" +
                        (liked === "dislike"
                          ? " text-primary-300"
                          : " text-grey-300")
                      }
                      onClick={doDislike}
                    >
                      <BiDislike
                        size={18}
                        color={liked === "dislike" ? "#A154FF" : ""}
                      />
                      {dislikes}
                    </div>
                  </div>
                  <div className="flex flex-row gap-2">
                    <div
                      className={
                        "w-[120px] xl:w-[140px] h-[36px] xl:h-[48px] text-[0.875rem] lg:text-[1rem] rounded-lg flex justify-center items-center hover:cursor-pointer font-bold" +
                        (followed
                          ? " bg-white text-primary-300"
                          : " bg-primary-300")
                      }
                      onClick={doFollow}
                    >
                      {followed ? "Unfollow" : "Follow"}
                    </div>

                    <div
                      className="bg-white text-BG text-black w-[120px] xl:w-[140px] h-[36px] xl:h-[48px] text-[0.875rem] lg:text-[1rem] rounded-lg flex justify-center items-center hover:cursor-pointer font-bold"
                      onClick={() => {
                        setDonated(true);
                      }}
                    >
                      <FaDollarSign />
                      Donate
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-grey-300 bg-[#FFFFFF05] p-4 border border-grey-800 rounded-lg mt-4">
              {videoData.description ? (
                <>
                  <div className="text-[1.25rem] sm:text-[1.5rem] break- font-semibold">
                    Description
                  </div>
                  <div className="overflow-y-scroll">
                    {videoData.description}
                  </div>
                </>
              ) : (
                "No description"
              )}
            </div>
          </div>
        </div>
      </div>
      {donated && (
        <DonateModal
          pk={videoData.creator.publickey}
          name={videoData.creator.fullname}
          username={videoData.creator.username}
          avatar={videoData.creator.avatar!}
          onClose={() => {
            setDonated(false);
          }}
        />
      )}
    </>
  );
}
