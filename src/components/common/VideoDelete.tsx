import React, { useState } from "react";
import Image from "next/image";

import { MdClose } from "react-icons/md";

import toast from "react-hot-toast";

import { getAccessToken } from "@/libs/helpers";
import FullLoading from "./FullLoading";
import { deleteVideo } from "@/services/video";

// Images
import deletePic from "@/assets/svgs/delete.svg";

export default function VideoDelete({
  id,
  onClose,
  onRefetch,
}: {
  id: string;
  onClose: () => void;
  onRefetch: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const doDelete = async () => {
    if (!id || loading) {
      return;
    }

    const token = getAccessToken();
    setLoading(true);
    try {
      const data = await deleteVideo({ videoId: id });
      toast.success("Successfully deleted", { duration: 3000 });
      onRefetch();
      onClose();
    } catch (err) {
      toast.error("Failed to delete", { duration: 3000 });
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-[#00000080]">
      {loading && <FullLoading />}
      <div className="flex flex-col items-center gap-[16px] w-[320px] sm:w-[540px] modal-center bg-[#19161C] rounded-lg p-[12px] sm:p-[24px]">
        <MdClose
          size={24}
          className="hover:cursor-pointer absolute top-4 right-4"
          onClick={() => {
            if (!loading) {
              onClose();
            }
          }}
        />
        <Image src={deletePic} alt="Delete" width={75} height={75} priority />
        <div className="flex justify-between text-[1.25rem] font-bold">
          Delete Content
        </div>
        <div className="text-[0.875rem] px-4 text-center">
          Are you are sure? You want to cancel this bookings
        </div>

        <div className="flex justify-end gap-[16px] mt-[16px]">
          <div
            className="w-[120px] lg:w-[160px] h-[36px] lg:h-[44px] text-[0.875rem] lg:text-[1rem] border border-1 border-solid border-grey-800 rounded-lg flex justify-center items-center hover:cursor-pointer font-semibold"
            onClick={() => {
              if (!loading) {
                onClose();
              }
            }}
          >
            Cancel
          </div>
          <div
            className="bg-primary-300 w-[120px] lg:w-[160px] h-[36px] lg:h-[44px] text-[0.875rem] lg:text-[1rem] rounded-lg flex justify-center items-center hover:cursor-pointer font-semibold"
            onClick={doDelete}
          >
            Confirm
          </div>
        </div>
      </div>
    </div>
  );
}
