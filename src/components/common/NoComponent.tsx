"use client"; // This is a client component

import React from "react";
import Image, { StaticImageData } from "next/image";

type Props = {
  content: string;
  source: StaticImageData;
};
export default function NoComponent({ content, source }: Props) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-[12px] text-[1.5rem] sm:text-[2rem] font-semibold p-[32px]">
      <Image src={source} alt="Comments" width={64} height={64} />
      {content}
    </div>
  );
}
