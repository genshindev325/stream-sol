import React, { useRef } from "react";
import Image from "next/image";

/// Icons
import { MdClose } from "react-icons/md";
import { RxCrop } from "react-icons/rx";

/// Built-in
import { useDropzone } from "react-dropzone";
import AvatarEditor from "react-avatar-editor";
import { useWallet } from "@solana/wallet-adapter-react";

/// Custom
import { dataURLtoFile } from "@/libs/helpers";
import { Button } from "../common";
import { updateProfile } from "@/services/profile";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { User } from "@/libs/types";

/// Images
import uploadPic from "@/assets/images/upload.png";
import toast from "react-hot-toast";

export default function AvatarUpload({
  onClose,
  setLoading,
}: {
  onClose: () => void;
  setLoading: (loading: boolean) => void;
}) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
    },
    maxFiles: 1,
  });
  const { publicKey } = useWallet();
  const imageRef = useRef<AvatarEditor>(null);
  const { user, setUser } = useAuthContext();

  const save = async () => {
    if (imageRef) {
      const canvas = imageRef.current?.getImage().toDataURL();

      if (canvas && publicKey) {
        setLoading(true);
        try {
          const formData = new FormData();
          const file = dataURLtoFile(canvas, `avatar_${publicKey}.png`);
          formData.append("file", file);
          const metadata = JSON.stringify({
            name: `avatar_${publicKey}`,
          });
          formData.append("pinataMetadata", metadata);

          const options = JSON.stringify({
            cidVersion: 1,
          });
          formData.append("pinataOptions", options);

          const res = await fetch(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
              },
              body: formData,
            }
          );

          const resData = await res.json();
          const avatar = resData.IpfsHash || "";

          const udpatedUser = await updateProfile({
            avatar,
          });

          setUser(udpatedUser);
        } catch (error) {
          toast.error("Failed to update your avatar", { duration: 3000 });
        }
        onClose();
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-30 bg-[#00000080] text-grey-300">
      <div className="modal-center bg-modal rounded-lg p-4 sm:p-6">
        <div className="flex gap-[16px]">
          <div className="border border-grey-500 p-[15px] w-[54px] h-[54px] rounded-lg">
            <RxCrop size={window.innerWidth >= 640 ? 24 : 20} color="#E4E4E4" />
          </div>
          <div className="flex-1">
            <div className="text-[1rem] sm:text-[1.25rem] font-semibold">
              Avatar
            </div>
            <div className="text-grey-500 text-[0.875rem] sm:text-[1rem]">
              Upload a 960 x 960px image for best results.
            </div>
          </div>
          <MdClose
            size={24}
            color="#E4E4E4"
            className="hover:cursor-pointer"
            onClick={onClose}
          />
        </div>

        <div className="relative bg-black w-[240px] sm:w-[360px] h-[240px] sm:h-[360px] mt-[16px] sm:mt-[32px] mx-auto rounded-lg">
          <AvatarEditor
            ref={imageRef}
            image={acceptedFiles[0]}
            width={window.innerWidth > 640 ? 360 : 240}
            height={window.innerWidth > 640 ? 360 : 240}
            border={0}
            color={[255, 255, 255, 0.6]}
            scale={1}
            rotate={0}
          />
          <div
            {...getRootProps({
              className: "dropzone ",
            })}
          >
            <input {...getInputProps()} />

            <Image
              src={uploadPic}
              className="w-[24px] h-[24px] absolute-center hover:cursor-pointer"
              alt="Upload"
            />
          </div>
        </div>
        <div className="flex justify-center gap-[16px] mt-[32px]">
          <Button text="Cancel" handleClick={onClose} />
          <Button text="Save Changes" primary handleClick={save} />
        </div>
      </div>
    </div>
  );
}
