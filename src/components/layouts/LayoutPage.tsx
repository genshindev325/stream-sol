"use client"; // This is a client component

import React from "react";
import HeaderPage from "./HeaderPage";

export default function LayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col bg-background text-white">
      <HeaderPage />
      <nav></nav>
      <div>{children}</div>
    </main>
  );
}
