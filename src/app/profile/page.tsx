"use client"; // This is a client component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/// Built-in Modules
import toast from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";

/// Custom Import
import { Button } from "@/components/common";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import BannerUpload from "@/components/profile/BannerUpload";
import AvatarUpload from "@/components/profile/AvatarUpload";
import { FullLoading } from "@/components/common";
import { uniqueUsername, updateProfile } from "@/services/profile";

/// Images
import userPic from "@/assets/svgs/user.svg";
import uploadPic from "@/assets/images/upload.png";

export default function EditProfile() {
  const { publicKey } = useWallet();
  const [cropHeaderVisible, setCropHeaderVisible] = useState(false);
  const [avatarVisible, setAvatarVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [banner, setBanner] = useState("");
  const [avatar, setAvatar] = useState("");
  const [pUsername, setPUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const { user, setUser } = useAuthContext();

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

    if (firstname.length + lastname.length >= 19) {
      toast.error("Full Name must be less than 20 characters", {
        duration: 3000,
      });
      return false;
    }

    if (!regexUserName.test(username)) {
      toast.error("User Name must be valid name", { duration: 3000 });
      return false;
    }

    if (username.length >= 13) {
      toast.error("User Name must be less than 13 characters", {
        duration: 3000,
      });
      return false;
    }

    if (description.length > 200) {
      toast.error("Description must be less than 200 characters", {
        duration: 3000,
      });
      return false;
    }
    return true;
  };

  const editProfile = async () => {
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
      const udpatedUser = await updateProfile({
        firstname,
        lastname,
        username,
        description,
      });

      setUser(udpatedUser);

      toast.success(`Profile was updated successfully`, { duration: 3000 });
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      if (errors?.username?.kind === "unique") {
        toast.error("Username was already used", { duration: 3000 });
      } else {
        toast.error("Failed to update your profile", { duration: 3000 });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      setFirstname(user.firstname);
      setLastname(user?.lastname || "");
      setPUsername(user.username);
      setUsername(user.username);
      setDescription(user?.description || "");
      setBanner(user?.banner || "");
      setAvatar(user?.avatar || "");
    }
  }, [user]);

  return (
    <>
      {loading && <FullLoading />}
      <div className="mx-auto md:w-[360px] lg:w-[600px] xl:w-[960px] mb-[32px]">
        <div className="relative">
          <Image
            src={uploadPic}
            className="w-[24px] h-[24px] absolute-center hover:cursor-pointer"
            alt="Upload"
            onClick={() => {
              setCropHeaderVisible(true);
            }}
          />
          {banner ? (
            <img
              src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${banner}`}
              className="w-full rounded-lg"
              crossOrigin="anonymous"
              alt="Banner"
              fetchPriority="high"
            />
          ) : (
            <div className="w-full h-[90px] lg:h-[150px] xl:h-[240px] bg-profile rounded-lg"></div>
          )}
        </div>
        <div className="flex gap-[8px] sm:gap-[16px] border-b border-1 border-grey-800 pb-[32px]">
          <div className="mt-[-12px] lg:mt-[-20px] ml-[12px] relative min-w-[64px] w-[64px] h-[64px] lg:min-w-[94px] lg:w-[94px] lg:h-[94px] rounded-full border-2 border-black">
            <Image
              src={uploadPic}
              className="w-[24px] h-[24px] absolute-center hover:cursor-pointer z-[1]"
              alt="Upload"
              onClick={() => {
                setAvatarVisible(true);
              }}
            />
            {avatar ? (
              <img
                src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${avatar}`}
                className="w-full h-full rounded-full"
                crossOrigin="anonymous"
                alt="Avatar"
              />
            ) : (
              <div className="bg-grey-900 w-full h-full rounded-full flex justify-center items-center hover:cursor-pointer">
                <div className="relative w-[36px] h-[36px] lg:w-[56px] lg:h-[56px]">
                  <Image src={userPic} alt="User" fill />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-[16px] w-full">
            <div className="flex-1">
              <div className="text-[20px] font-semibold">
                {user?.fullname || ""}
              </div>
              <div
                className="text-[14px] font-light hover:cursor-pointer"
                onClick={() => {
                  if (pUsername !== "") {
                    router.push(`/profile/${pUsername}`);
                  }
                }}
              >
                {pUsername === "" ? "" : "@" + pUsername}
              </div>
            </div>
            <Button
              text="View My Profile"
              primary
              handleClick={() => {
                if (pUsername !== "") {
                  router.push(`/profile/${pUsername}`);
                }
              }}
            />
          </div>
        </div>
        <div className="flex flex-col xl:flex-row gap-[16px] mt-[32px]">
          <div className="flex flex-col xl:w-[40%]">
            <span className="font-bold text-[18px]">Personal Info</span>
            <span className="text-[14px]">
              Update your photo and personal details
            </span>
          </div>
          <div className="flex flex-col grow border border-1 border-grey-800 rounded-lg p-[16px]">
            <div className="flex flex-col lg:flex-row gap-[16px] w-full">
              <div className="lg:w-1/2">
                First Name *
                <div className="border border-1 border-grey-800 rounded-lg mt-[8px]">
                  <input
                    type="text"
                    spellCheck={false}
                    value={firstname}
                    onChange={(e) => {
                      const name = e.target.value;
                      if (name.length < 20) {
                        setFirstname(name);
                      }
                    }}
                    className="text-white indent-2 h-[40px] text-[16px] bg-transparent border-none focus:outline-none focus:box-shadow:none"
                  />
                </div>
              </div>
              <div className="lg:w-1/2">
                Last Name *
                <div className="border border-1 border-grey-800 rounded-lg mt-[8px]">
                  <input
                    type="text"
                    spellCheck={false}
                    value={lastname}
                    onChange={(e) => {
                      const name = e.target.value;
                      if (name.length < 20) {
                        setLastname(name);
                      }
                    }}
                    className="text-white indent-2 h-[40px] text-[16px] bg-transparent border-none focus:outline-none focus:box-shadow:none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-[16px] mt-[32px] pt-[32px] border-t border-1 border-grey-800">
          <div className="flex flex-col xl:w-[40%]">
            <span className="font-bold text-[18px]">Profile</span>
            <span className="text-[14px]">Update your portfolio and bio.</span>
          </div>
          <div className="flex flex-col grow border border-1 border-grey-800 rounded-lg p-[16px]">
            <div className="mt-[16px]">
              Username *
              <div className="relative border border-1 border-grey-800 rounded-lg mt-[8px] px-[8px]">
                <div className="absolute w-[90px] h-full flex items-center border-r border-1 border-grey-800">
                  sol.media/
                </div>
                <input
                  type="text"
                  spellCheck={false}
                  value={username}
                  onChange={(e) => {
                    const name = e.target.value;
                    setUsername(name);
                  }}
                  className="text-white indent-2 h-[40px] w-full pl-[90px] text-[16px] bg-transparent border-none focus:outline-none focus:[box-shadow:none"
                />
              </div>
            </div>
            <div className="mt-[16px]">
              Description *
              <div className="relative border border-1 border-grey-800 rounded-lg mt-[8px] px-[8px]">
                <textarea
                  spellCheck={false}
                  value={description}
                  onChange={(e) => {
                    const description = e.target.value;
                    setDescription(description);
                  }}
                  className="text-white indent-2 h-[120px] py-[8px] w-full text-[16px] bg-transparent border-none focus:outline-none focus:[box-shadow:none"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-[16px] mt-[32px]">
          <Button
            text="Cancel"
            handleClick={() => {
              router.back();
            }}
          />
          <Button text="Update" primary handleClick={editProfile} />
        </div>
      </div>
      {cropHeaderVisible && (
        <BannerUpload
          onClose={() => {
            setCropHeaderVisible(false);
          }}
          setLoading={setLoading}
        />
      )}

      {avatarVisible && (
        <AvatarUpload
          onClose={() => {
            setAvatarVisible(false);
          }}
          setLoading={setLoading}
        />
      )}
    </>
  );
}
