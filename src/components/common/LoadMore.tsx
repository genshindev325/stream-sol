"use client"; // This is a client component

import React from "react";
import { FaChevronDown } from "react-icons/fa";

export default function LoadMore({ showMore }: { showMore: () => void }) {
  return (
    <div className="relative flex justify-center w-full mt-4 mb-24 sm:mb-8">
      <div className="absolute top-[16px] h-[2px] w-full bg-grey-800"></div>
      <div
        className="flex items-center justify-center gap-4 text-grey-300 text-[0.875rem] sm:text-[1rem] bg-background border border-grey-800 rounded-2xl py-1 px-8 z-[1] hover:cursor-pointer"
        onClick={showMore}
      >
        Show more
        <FaChevronDown size={16} color="#E4E4E4" />
      </div>
    </div>
  );
}
