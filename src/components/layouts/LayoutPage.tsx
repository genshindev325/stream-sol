"use client"; // This is a client component

import React, { useState } from "react";
import HeaderPage from "./HeaderPage";
import SiderPage from "./SiderPage";

export default function LayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const [siderVisible, setSiderVisible] = useState<boolean>(false);

  return (
    <main className="flex min-h-screen flex-col bg-background text-white">
      <HeaderPage setSiderVisible={setSiderVisible} />
      <SiderPage
        siderVisible={siderVisible}
        setSiderVisible={setSiderVisible}
      />
      <div className={`p-4 sm:p-6 md:ml-[280px] ${siderVisible ? "ml-[280px]" : "ml-0"}`}>
        {children}
      </div>
    </main>
  );
}
