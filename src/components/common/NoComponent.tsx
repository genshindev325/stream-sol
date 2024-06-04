"use client"; // This is a client component

import React from "react";
import Image from "next/image";
import whiteLogoPic from "@/assets/images/white_logo.png";

type Props = {
  content: string;
};
export default function NoComponent({ content }: Props) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-[12px] text-[1.5rem] sm:text-[2rem] font-semibold p-[32px]">
      <Image src={whiteLogoPic} alt="Comments" width={64} height={64} />
      {content}
    </div>
  );
}
