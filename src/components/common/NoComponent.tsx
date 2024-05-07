"use client"; // This is a client component

import React from "react";
import Image from "next/image";

export default function NoComponent({
  content,
  source,
}: {
  content: string;
  source: string;
}) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-[12px] text-[1.5rem] sm:text-[2rem] font-semibold p-[32px]">
      <Image
        src={`/images/${source}`}
        alt="Comments"
        width={100}
        height={100}
      />
      {content}
    </div>
  );
}
