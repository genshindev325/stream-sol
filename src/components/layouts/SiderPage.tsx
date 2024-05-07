"use client"; // This is a client component

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/// Icons
import { GoHome } from "react-icons/go";
import { CiStreamOn } from "react-icons/ci";
import {
  MdClose,
  MdOutlineAdminPanelSettings,
  MdOutlineAnnouncement,
} from "react-icons/md";
import { TbUserUp, TbUserDown } from "react-icons/tb";

/// Custom
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { ADMIN_WALLETS } from "@/libs/constants";

/// Images
import logoPic from "@/assets/images/logo.png";

export default function SiderPage({
  siderVisible,
  setSiderVisible,
}: {
  siderVisible: boolean;
  setSiderVisible: (visible: boolean) => void;
}) {
  const { user } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const selected = pathname.split("/")[1];

  return (
    <div
      className={
        "fixed w-full md:w-[280px] h-full md:pt-[80px] z-20 md:z-0 top-0 md:flex flex-col gap-[8px] py-[24px] bg-background border-r border-1 border-solid border-[#FFFFFF0D] " +
        (siderVisible ? " flex" : " hidden")
      }
    >
      <div className="flex justify-between items-center md:hidden mb-4 ml-6 mr-16">
        <Image
          src={logoPic}
          alt="Picture of the Logo"
          className="w-[120px] h-[28px]"
        />
      </div>

      <MdClose
        size={32}
        className="block md:hidden absolute top-[8px] right-[8px] hover:cursor-pointer"
        onClick={() => {
          setSiderVisible(false);
        }}
      />

      {/* Home Sidebar */}

      <Link
        href="/"
        className={
          "flex items-center gap-[16px] h-[48px] rounded-lg p-[8px] mx-[16px] text-[1rem] sm:text-[1.25rem] hover:cursor-pointer" +
          (selected === ""
            ? " text-white bg-[#FFFFFF0A]"
            : " text-grey-400 hover:bg-[#FFFFFF0A]")
        }
      >
        <GoHome size={24} color={selected === "" ? "white" : "#BFBFBF"} />
        <span className="font-semibold block">Home</span>
      </Link>

      {user && (
        <>
          {/* Divider */}

          <div className="h-[1px] w-full bg-grey-800"></div>

          {/* Create LiveStream */}

          <Link
            href="/livestream"
            className={
              "flex items-center gap-[16px] h-[48px] rounded-lg p-[8px] mx-[16px] text-[1rem] sm:text-[1.25rem] hover:cursor-pointer" +
              (selected === "livestream"
                ? " text-white bg-[#FFFFFF0A]"
                : " text-grey-400 hover:bg-[#FFFFFF0A]")
            }
          >
            <CiStreamOn
              size={24}
              color={selected === "livestream" ? "white" : "#BFBFBF"}
            />

            <span className="font-semibold block">Create LiveStream</span>
          </Link>

          {/* Create Announcement */}

          <Link
            href="/announcement"
            className={
              "flex items-center gap-[16px] h-[48px] rounded-lg p-[8px] mx-[16px] text-[1rem] sm:text-[1.25rem] hover:cursor-pointer" +
              (selected === "announcement"
                ? " text-white bg-[#FFFFFF0A]"
                : " text-grey-400 hover:bg-[#FFFFFF0A]")
            }
          >
            <MdOutlineAnnouncement
              size={24}
              color={selected === "announcement" ? "white" : "#BFBFBF"}
            />

            <span className="font-semibold block">Announcement</span>
          </Link>

          {/* Following */}

          <Link
            href="/following"
            className={
              "flex items-center gap-[16px] h-[48px] rounded-lg p-[8px] mx-[16px] text-[1rem] sm:text-[1.25rem] hover:cursor-pointer" +
              (selected === "following"
                ? " text-white bg-[#FFFFFF0A]"
                : " text-grey-400 hover:bg-[#FFFFFF0A]")
            }
          >
            <TbUserUp
              size={24}
              color={selected === "following" ? "white" : "#BFBFBF"}
            />

            <span className="font-semibold block">Following</span>
          </Link>

          {/* Followers */}

          <Link
            href="/followers"
            className={
              "flex items-center gap-[16px] h-[48px] rounded-lg p-[8px] mx-[16px] text-[1rem] sm:text-[1.25rem] hover:cursor-pointer" +
              (selected === "followers"
                ? " text-white bg-[#FFFFFF0A]"
                : " text-grey-400 hover:bg-[#FFFFFF0A]")
            }
          >
            <TbUserDown
              size={24}
              color={selected === "followers" ? "white" : "#BFBFBF"}
            />

            <span className="font-semibold block">Followers</span>
          </Link>

          {user && ADMIN_WALLETS.includes(user.publickey) && (
            <Link
              href="/admin"
              className={
                "flex items-center gap-[16px] h-[48px] rounded-lg p-[8px] mx-[16px] text-[1rem] sm:text-[1.25rem] hover:cursor-pointer" +
                (selected === "admin"
                  ? " text-white bg-[#FFFFFF0A]"
                  : " text-grey-400 hover:bg-[#FFFFFF0A]")
              }
            >
              <MdOutlineAdminPanelSettings size={24} />
              <span className="font-semibold block">Admin</span>
            </Link>
          )}
        </>
      )}
    </div>
  );
}
