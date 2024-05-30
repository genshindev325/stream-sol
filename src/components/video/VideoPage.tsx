"use client"; // This is a client component

import { useEffect, useState } from "react";

// Icons
import { FaDollarSign } from "react-icons/fa";

// Custom
import { Video, User } from "@/libs/types";
import { AvatarComponent } from "../common";

type Props = {
  videoData: Video;
  userData: User;
};

export default function VideoPage({ videoData, userData }: Props) {
  return (
    <>
      <div className="flex flex-1 flex-col p-[12px] sm:p-[16px]">
        <div className="flex max-xl:flex-col gap-[16px] mx-auto mb-[32px] sm:mb-[48px]">
          <div className="flex flex-col grow gap-[16px] m-[10px]">
            <div className="mx-auto relative">
              <video
                src={videoData.url}
                className="aspect-video rounded-xl lg:w-[800px]"
                controls
              />
            </div>

            <div className="text-[1.25rem] sm:text-[1.5rem] break- font-semibold">
              {videoData.title}
            </div>
            <div className="flex flex-col lg:flex-row justify-between gap-4 mt-4">
              <div className="flex gap-2 hover:cursor-pointer">
                <AvatarComponent avatar={userData?.avatar} size={44} />
                <div className="flex flex-col">
                  <div className="text-[0.875rem] sm:text-[1rem] text-grey-300">
                    {userData.username}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-white text-BG text-black w-[120px] xl:w-[140px] h-[36px] xl:h-[48px] text-[0.875rem] sm:text-[1rem] rounded-lg flex justify-center items-center hover:cursor-pointer font-bold">
                  <FaDollarSign />
                  Donate
                </div>
              </div>
            </div>
            <div className="text-grey-300 bg-[#FFFFFF05] p-4 border border-grey-800 rounded-lg mt-4">
              {videoData?.description ? (
                <>
                  <div className="text-[1.25rem] sm:text-[1.5rem] break- font-semibold">
                    Description
                  </div>
                  <div className="overflow-y-scroll">
                    {videoData?.description}
                  </div>
                </>
              ) : (
                "No description"
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
