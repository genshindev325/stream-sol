"use client"; // This is a client component

import React from "react";
import Image from "next/image";

/// Images
import userPic from "@/assets/svgs/user.svg";

export default function AvatarComponent({
  avatar,
  size,
}: {
  avatar: string | undefined;
  size: number;
}) {
  return (
    <div
      className="rounded-full"
      style={{ minWidth: size + 4, width: size + 4, height: size + 4 }}
    >
      {avatar ? (
        <img
          src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${avatar}`}
          className="w-full h-full rounded-full"
          crossOrigin="anonymous"
          alt="Avatar"
          fetchPriority="high"
        />
      ) : (
        <div className="bg-grey-900 w-full h-full rounded-full flex justify-center items-center hover:cursor-pointer">
          <Image
            src={userPic}
            alt="user"
            width={size / 2}
            height={size / 2}
            priority
          />
        </div>
      )}
    </div>
  );
}
