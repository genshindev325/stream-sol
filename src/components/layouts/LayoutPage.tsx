"use client"; // This is a client component

import React, { useState } from "react";
import HeaderPage from "./HeaderPage";
import SiderPage from "./SiderPage";

import { HuddleClient, HuddleProvider } from "@huddle01/react";

const huddleClient = new HuddleClient({
  projectId:
    process.env.NEXT_PUBLIC_HUDDLE_PROJECT_ID ||
    "KoSLC9x-ps81o_uCRolmp8qPJErcOsYR",
  options: {
    activeSpeakers: {
      size: 12,
    },
  },
});

export default function LayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const [siderVisible, setSiderVisible] = useState<boolean>(false);

  return (
    <main className="flex min-h-screen flex-col bg-background text-white">
      <HuddleProvider client={huddleClient}>
        <HeaderPage setSiderVisible={setSiderVisible} />
        <SiderPage
          siderVisible={siderVisible}
          setSiderVisible={setSiderVisible}
        />
        <div
          className={`flex flex-col flex-1 p-4 sm:p-6 md:ml-[280px] ${
            siderVisible ? "ml-[280px] hidden md:block" : "ml-0"
          }`}
        >
          {children}
        </div>
      </HuddleProvider>
    </main>
  );
}
