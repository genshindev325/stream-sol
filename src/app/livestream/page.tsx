"use client"; // This is a client component

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/// Built-in Modules
import axios from "axios";
import toast from "react-hot-toast";

/// Custom Import
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { FullLoading, NoWallet } from "@/components/common";

/// Images
import uploadPic from "@/assets/svgs/upload.svg";

/// Livestream service
import { createLivestream } from "@/services/livestream";
import { getRoomAccessToken } from "@/services/room";

const createHuddleRoom = async (title: string) => {
  const response = await fetch("https://api.huddle01.com/api/v1/create-room", {
    method: "POST",
    body: JSON.stringify({
      title,
    }),
    headers: {
      "Content-type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_HUDDLE_API_KEY || "",
    },
  });

  const data = await response.json();

  const roomId = data.data.roomId;

  return roomId;
};

export default function UploadVideo() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const thumbnailFileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const { user } = useAuthContext();

  const handleImageClick = (e: any) => {
    if (thumbnailFileRef.current) {
      thumbnailFileRef.current.click();
    }
  };

  const handleImageChange = (e: any) => {
    const fileUploaded = e.target.files[0];
    if (fileUploaded) {
      setThumbnailFile(fileUploaded);
    }
  };

  const validateForm = () => {
    const regexTitle = /^[A-Za-z0-9]+$/;
    const regexLink = /^[a-zA-Z0-9\-_:.\/?=&"{}()]+$/;

    if (title == "" || !regexTitle.test(title)) {
      toast.error("A stream title must be non-empty and valid", {
        duration: 3000,
      });
      return false;
    }

    if (text == "" || !regexTitle.test(text)) {
      toast.error("A stream text must be non-empty and valid", {
        duration: 3000,
      });
      return false;
    }

    if (link == "" || !regexLink.test(link)) {
      toast.error("A stream link must be non-empty and valid", {
        duration: 3000,
      });
      return false;
    }

    if (thumbnailFile === null) {
      toast.error("Thumbnail image must be valid", {
        duration: 3000,
      });
      return false;
    }

    return true;
  };

  const create = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      const options = JSON.stringify({
        cidVersion: 1,
      });

      const imageFormData = new FormData();
      if (thumbnailFile) {
        // Perform a null check on thumbnailFile
        imageFormData.append("file", thumbnailFile);
      }
      imageFormData.append("pinataOptions", options);
      const resImage = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        imageFormData,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
        }
      );

      const imageHashValue = resImage.data.IpfsHash;

      const livestream = await createLivestream({
        title,
        description,
        text,
        link,
        thumbnail: imageHashValue,
      });

      toast.success("Successfully uploaded", { duration: 3000 });
      const roomId = await createHuddleRoom(title);
      router.push(`/livestream/${roomId}`);
    } catch (err) {
      toast.error("Failed to create a livestream", { duration: 3000 });
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (thumbnailFile) {
      if (imageRef.current) {
        imageRef.current.src = URL.createObjectURL(thumbnailFile);
      }
    }
  }, [thumbnailFile]);

  if (!user) {
    return <NoWallet />;
  }

  return (
    <>
      {loading && <FullLoading />}
      <div className="mx-auto mb-[32px]">
        <div className="text-[1.5rem] sm:text-[2rem] font-bold text-center">
          Create livestream
        </div>
        <div className="flex flex-col xl:flex-row gap-8 mt-4">
          <div className="flex flex-col justify-center items-center w-[352px] sm:w-[560px] md:w-[400px] xl:w-[448px] 2xl:w-[560px] h-[198px] sm:h-[315px] md:h-[225px] xl:h-[252px] 2xl:h-[315px] border border-1 border-grey-800 rounded-lg">
            <input
              type="file"
              onChange={handleImageChange}
              ref={thumbnailFileRef}
              disabled={loading}
              accept="image/*"
              className="hidden"
            />

            <img ref={imageRef} className="max-w-full max-h-full rounded-lg" />
            <div
              className={
                "flex flex-col justify-center items-center w-full h-full" +
                (thumbnailFile !== null ? " hidden" : "")
              }
            >
              <div
                className="flex justify-center items-center w-[60px] sm:w-[80px] h-[60px] sm:h-[80px] bg-[#FFFFFF14] rounded-full mb-4 hover:cursor-pointer"
                onClick={handleImageClick}
              >
                <div className="relative w-[28px] sm:w-[36px] h-[28px] sm:h-[36px]">
                  <Image src={uploadPic} alt="upload" fill />
                </div>
              </div>
              <div className="text-[1rem] sm:text-[1.25rem]">
                Click here to upload a thumbnail image
              </div>
              <div className="text-grey-500 text-[0.875rem] sm:text-[1rem]">
                Secure uploads via filecoin Solana IPFS storage
              </div>
              <div className="text-primary-300 text-center text-[0.875rem] sm:text-[1rem] text-ellipsis line-clamp-1 break-words">
                {thumbnailFile?.name}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-[352px] sm:w-[560px] md:w-[400px] xl:w-[448px] 2xl:w-[560px]">
            <div className="text-[1rem] sm:text-[1.25rem] border-b border-1 border-grey-800 pb-4">
              Stream info
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-grey-400 text-[0.875rem] sm:text-[1rem]">
                Stream title*
              </div>
              <div className="border border-grey-800 px-4 rounded-lg">
                <input
                  type="text"
                  placeholder="Type here"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  spellCheck={false}
                  disabled={loading}
                  className="text-white h-[48px] text-[0.875rem] sm:text-[1rem] placeholder:text-grey-700 bg-transparent border-none focus:outline-none focus:box-shadow:none w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-grey-400 text-[0.875rem] sm:text-[1rem]">
                Stream description
              </div>
              <div className="border border-grey-800 p-4 rounded-lg">
                <textarea
                  placeholder="Type here"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  spellCheck={false}
                  disabled={loading}
                  className="text-white h-[120px] text-[0.875rem] sm:text-[1rem] placeholder:text-grey-700 bg-transparent border-none focus:outline-none focus:box-shadow:none w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-grey-400 text-[0.875rem] sm:text-[1rem]">
                Stream Text*
              </div>
              <div className="border border-grey-800 px-4 rounded-lg">
                <input
                  type="text"
                  placeholder="Type here"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                  spellCheck={false}
                  disabled={loading}
                  className="text-white h-[48px] text-[0.875rem] sm:text-[1rem] placeholder:text-grey-700 bg-transparent border-none focus:outline-none focus:box-shadow:none w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-grey-400 text-[0.875rem] sm:text-[1rem]">
                Stream Link*
              </div>
              <div className="border border-grey-800 px-4 rounded-lg">
                <input
                  type="text"
                  placeholder="Type here"
                  value={link}
                  onChange={(e) => {
                    setLink(e.target.value);
                  }}
                  spellCheck={false}
                  disabled={loading}
                  className="text-white h-[48px] text-[0.875rem] sm:text-[1rem] placeholder:text-grey-700 bg-transparent border-none focus:outline-none focus:box-shadow:none w-full"
                />{" "}
              </div>
            </div>
            <div className="flex gap-[16px] border-t border-grey-800 pt-4">
              <div
                className="bg-primary-300 w-[120px] lg:w-[160px] h-[36px] lg:h-[48px] text-[0.875rem] lg:text-[1rem] rounded-lg flex justify-center items-center hover:cursor-pointer font-semibold"
                onClick={create}
              >
                Create
              </div>
              <div
                className="w-[120px] lg:w-[160px] h-[36px] lg:h-[48px] text-[0.875rem] sm:text-[1rem] border border-1 border-grey-800 hover:cursor-pointer font-semibold rounded-lg flex justify-center items-center"
                onClick={() => {
                  router.back();
                }}
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
