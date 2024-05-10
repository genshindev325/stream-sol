"use client"; // This is a client component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/// React icons
import { MdClose } from "react-icons/md";

/// Built-in imports
import toast from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";

/// Custom
import { Button, FullLoading, NoComponent } from "@/components/common";
import { signUp } from "@/services/user";
import { useAuthContext } from "@/contexts/AuthContextProvider";

/// Images
import peoplePic from "@/assets/images/people.png";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();
  const { publicKey, disconnect } = useWallet();
  const { setUser } = useAuthContext();

  const validateForm = () => {
    const regexName = /^[A-Za-z]+$/;
    const regexUserName = /^[A-Za-z0-9_]+$/;

    if (!regexName.test(firstname)) {
      toast.error("First Name must be valid name", { duration: 3000 });
      return false;
    }

    if (lastname !== "" && !regexName.test(lastname)) {
      toast.error("Last Name must be valid name", { duration: 3000 });
      return false;
    }

    if (!regexUserName.test(username)) {
      toast.error("User Name must be valid name", { duration: 3000 });
      return false;
    }

    if (username.length > 12) {
      toast.error("User Name max length is 12", {
        duration: 3000,
      });
      return false;
    }

    if (description.length > 200) {
      toast.error("Description max length is 200", {
        duration: 3000,
      });
      return false;
    }
    return true;
  };

  const register = async () => {
    if (!publicKey) {
      toast.error("Connect your wallet", { duration: 3000 });
      return;
    }

    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    setLoading(true);
    try {
      const user = await signUp({
        firstname,
        lastname,
        username,
        description,
      });
      setUser(user);
      toast.success("Successfully Created", { duration: 3000 });
      router.push("/");
    } catch (err: any) {
      const errorStatus = err?.response?.status;
      if (errorStatus === 409) {
        toast.error("Username was already used", { duration: 3000 });
      } else {
        toast.error("Failed to Creat your profile", { duration: 3000 });
      }
    }
    setLoading(false);
  };

  if (!publicKey) {
    return <NoComponent content="Connect Your Wallet" source={peoplePic} />;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-background">
      {loading && <FullLoading />}
      <div className="flex flex-col gap-4 text-grey-300 w-[320px] sm:w-[540px] bg-modal rounded-lg p-3 sm:p-6 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-between text-[1.25rem] sm:text-[1.5rem] font-bold">
          Create your profile
          <MdClose
            size={24}
            className="hover:cursor-pointer"
            onClick={() => {
              if (!loading) {
                disconnect();
                router.push("/");
              }
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="sm:w-1/2">
            First Name *
            <div className="border border-grey-500 mt-[8px] px-[8px] rounded-lg">
              <input
                type="text"
                value={firstname}
                onChange={(e) => {
                  setFirstname(e.target.value);
                }}
                spellCheck={false}
                disabled={loading}
                className="h-[40px] text-[16px] bg-transparent border-none focus:outline-none focus:box-shadow:none w-full"
              />
            </div>
          </div>
          <div className="sm:w-1/2">
            Last Name
            <div className="border border-grey-500 mt-[8px] px-[8px] rounded-lg">
              <input
                type="text"
                value={lastname}
                onChange={(e) => {
                  setLastname(e.target.value);
                }}
                spellCheck={false}
                disabled={loading}
                className="h-[40px] text-[16px] bg-transparent border-none focus:outline-none focus:box-shadow:none w-full"
              />
            </div>
          </div>
        </div>

        <div className="">
          Username *
          <div className="relative border border-grey-500 rounded-lg mt-[8px] px-[8px]">
            <div className="absolute w-[90px] h-full flex items-center border-r border-grey-500">
              sol.media/
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              spellCheck={false}
              disabled={loading}
              className="indent-2 h-[40px] w-full pl-[90px] text-[16px] bg-transparent border-none focus:outline-none focus:[box-shadow:none"
            />
          </div>
        </div>

        <div className="">
          Description
          <div className="border border-grey-500 mt-[8px] p-[8px] rounded-lg">
            <textarea
              spellCheck={false}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              disabled={loading}
              className="h-[80px] text-[16px] bg-transparent border-none focus:outline-none focus:box-shadow:none w-full"
            />
          </div>
        </div>
        <div className="flex justify-end gap-[16px] mt-[16px]">
          <Button
            text="Cancel"
            handleClick={() => {
              if (!loading) {
                disconnect();
                router.push("/");
              }
            }}
          />
          <Button
            text="Save"
            primary
            handleClick={() => {
              if (!loading) {
                register();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
