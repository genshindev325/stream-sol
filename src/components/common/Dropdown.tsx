"use client"; // This is a client component

import { useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";

export function Dropdown({
  children,
  trigger,
  right = true,
  isShow = true,
}: {
  children: React.ReactNode;
  trigger: React.ReactNode;
  right?: boolean;
  isShow?: boolean;
}) {
  const [show, setShow] = useState(false);
  const dropRef = useClickOutside(() => setShow(false));

  return (
    <div className="w-fit relative" ref={dropRef}>
      <div
        onClick={() => {
          setShow((curr) => !curr);
        }}
      >
        {trigger}
      </div>
      {show && (
        <ul
          className={
            "w-[280px] mt-4 absolute custom-shadow rounded-lg overflow-hidden" +
            (right ? " right-0" : " left-0")
          }
          onClick={() => {
            if (isShow) {
              setShow((curr) => !curr);
            }
          }}
        >
          {children}
        </ul>
      )}
    </div>
  );
}

export function Select({
  children,
  trigger,
}: {
  children: React.ReactNode;
  trigger: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const dropRef = useClickOutside(() => setShow(false));

  return (
    <div
      className="w-fit relative"
      ref={dropRef}
      onClick={() => {
        setShow((curr) => !curr);
      }}
    >
      <div>{trigger}</div>
      {show && (
        <ul className="w-[352px] sm:w-[560px] md:w-[640px] lg:w-[448px] xl:w-[560px] 2xl:w-[640px] h-[180px] text-[0.875rem] sm:text-[1rem] overflow-y-visible mt-2 absolute custom-shadow rounded-lg overflow-hidden right-0">
          {children}
        </ul>
      )}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <li
      className="flex gap-1 items-center py-1 cursor-pointer"
      onClick={onClick}
    >
      {children}
    </li>
  );
}
