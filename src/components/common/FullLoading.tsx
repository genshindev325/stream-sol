"use client"; // This is a client component

import React from "react";
import Image from "next/image";

/// Images
import loadingGif from "@/assets/images/loading.gif";

export default function FullLoading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[#00000090] z-40">
      <Image
        src={loadingGif}
        className="absolute-center"
        width={48}
        height={48}
        priority={true}
        alt="Loading"
      />
    </div>
  );
}
