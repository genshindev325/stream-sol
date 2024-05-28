"use client";

import { Archievedstream } from "@/libs/types";
import { Inter } from "next/font/google";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import AvatarComponent from "../common/AvatarComponent";
import { FaDollarSign } from "react-icons/fa";
import { useWallet } from "@solana/wallet-adapter-react";
import { getProfileByUsername } from "@/services/profile";
import { IUser } from "@/models/user";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  archievedstreamData: Archievedstream;
};

export default function ArchievedstreamPage({ archievedstreamData }: Props) {
  const { user } = useAuthContext();
  const { publicKey: walletKey } = useWallet();
  const router = useRouter();
  const [userData, setUserData] = useState<IUser>();

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getProfileByUsername(user?.username!);
      console.log(userData);
      setUserData(userData);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-1 flex-col p-[12px] sm:p-[16px]">
        <div className="flex max-xl:flex-col gap-[16px] mx-auto mb-[32px] sm:mb-[48px]">
          <div className="flex flex-col grow gap-[16px] m-[10px]">
            <div className="mx-auto relative">
              <video
                src={archievedstreamData.video}
                className="aspect-video rounded-xl lg:w-[800px]"
                autoPlay
                muted
              />
            </div>

            <div className="z-10 max-w-20xl w-full items-center justify-center font-mono text-[1.5rem] lg:flex">
              {/* <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
              <code className="font-mono font-bold">{state}</code>
            </p> */}
            </div>

            <div className="text-[1.25rem] sm:text-[1.5rem] break- font-semibold">
              {archievedstreamData?.title}
            </div>
            <div className="flex flex-col lg:flex-row justify-between gap-4 mt-4">
              {/* <div className="flex flex-col justify-between sm:flex-row gap-2 sm:gap-4"> */}
              <div className="flex gap-2 hover:cursor-pointer">
                <AvatarComponent avatar={userData?.avatar} size={44} />
                <div className="flex flex-col">
                  <div className="text-[0.875rem] sm:text-[1rem] text-grey-300">
                    {userData?.username}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-[120px] xl:w-[140px] h-[36px] xl:h-[44px] text-[0.875rem] lg:text-[1rem] rounded-lg flex justify-center items-center hover:cursor-pointer font-semibold bg-primary-300 ">
                  Follow
                </div>
                <div className="bg-white text-BG text-black w-[120px] xl:w-[140px] h-[36px] xl:h-[48px] text-[0.875rem] sm:text-[1rem] rounded-lg flex justify-center items-center hover:cursor-pointer font-bold">
                  <FaDollarSign />
                  Donate
                </div>
              </div>
              {/* </div> */}
            </div>
            <div className="text-grey-300 bg-[#FFFFFF05] p-4 border border-grey-800 rounded-lg mt-4">
              {archievedstreamData?.description ? (
                <>
                  <div className="text-[1.25rem] sm:text-[1.5rem] break- font-semibold">
                    Description
                  </div>
                  <div className="overflow-y-scroll">
                    {archievedstreamData?.description}
                  </div>
                </>
              ) : (
                "No description"
              )}
            </div>

            {/* <div className="mt-8 mb-32 grid gap-2 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
          {peerIds.map((peerId) =>
            peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null
          )}
        </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
