import React, { useRef } from "react";
import Image from "next/image";

/// Icons
import { RxCrop } from "react-icons/rx";
import { MdClose } from "react-icons/md";

/// Built-in
import { useWallet } from "@solana/wallet-adapter-react";
import { useDropzone } from "react-dropzone";
import AvatarEditor from "react-avatar-editor";

/// Custom
import { dataURLtoFile } from "@/libs/helpers";
import { updateProfile } from "@/services/profile";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { Button } from "../common";

/// Images
import uploadPic from "@/assets/images/upload.png";

export default function BannerUpload({
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
  const { setUser } = useAuthContext();

  const save = async () => {
    if (imageRef) {
      const canvas = imageRef.current?.getImage().toDataURL();

      if (canvas && publicKey) {
        setLoading(true);
        onClose();
        try {
          const formData = new FormData();
          const file = dataURLtoFile(canvas, `banner_${publicKey}.png`);
          formData.append("file", file);
          const metadata = JSON.stringify({
            name: `banner_${publicKey}`,
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

          const udpatedUser = await updateProfile({
            banner: resData.IpfsHash,
          });

          setUser(udpatedUser);
        } catch (error) {
          console.error(error);
        }
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-[#00000080] text-grey-300">
      <div className="modal-center bg-modal rounded-lg p-4 sm:p-6">
        <div className="flex gap-2 sm:gap-4">
          <div className="border border-grey-500 p-[15px] w-[40px] sm:w-[54px] h-[40px] sm:h-[54px] rounded-lg">
            <RxCrop size={window.innerWidth >= 640 ? 24 : 20} color="#E4E4E4" />
          </div>
          <div className="flex-1">
            <div className="text-[1rem] sm:text-[1.25rem] font-semibold">
              Crop Header
            </div>
            <div className="text-grey-500 text-[0.875rem] sm:text-[1rem]">
              Upload a 1800 x 400px image for best results.
            </div>
          </div>
          <MdClose
            size={24}
            color="#E4E4E4"
            className="hover:cursor-pointer"
            onClick={onClose}
          />
        </div>

        <div className="relative bg-black w-[320px] sm:w-[560px] h-[70px] sm:h-[124px] mt-[16px] sm:mt-[32px] rounded-lg">
          <AvatarEditor
            ref={imageRef}
            image={acceptedFiles[0]}
            width={window.innerWidth >= 640 ? 560 : 320}
            height={window.innerWidth >= 640 ? 124 : 70}
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
        <div className="flex justify-end gap-[16px] mt-[32px]">
          <Button text="Cancel" handleClick={onClose} />
          <Button text="Save Changes" primary handleClick={save} />
        </div>
      </div>
    </div>
  );
}
