"use client"; // This is a client component

import React from "react";
import Image from "next/image";

/// Images
import loadingGif from "@/assets/images/loading.gif";

export default function PageLoading() {
  return (
    <div className="relative flex-1">
      <Image
        src={loadingGif}
        className="absolute-center"
        width={48}
        height={48}
        priority
        alt="Loading"
      />
    </div>
  );
}
