"use client"; // This is a client component

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

/// Custom
import { NoComponent, PageLoading, NoWallet } from "@/components/common";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { Livestream, User } from "@/libs/types";
import { getLivestreamsByUser } from "@/services/livestream";

export default function LiveBroadcast({ profile }: { profile: User }) {
  const [loading, setLoading] = useState(false);
  const [streams, setStreams] = useState<Array<Livestream>>([]);
  const { user } = useAuthContext();
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getLivestreamsByUser(profile.publickey);
      setStreams(data.streams);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!user) {
    return <NoWallet />;
  }

  return (
    <>
      {loading ? (
        <PageLoading />
      ) : streams.length === 0 ? (
        <NoComponent content="No Livestream" />
      ) : (
        <div className="flex flex-1 flex-col">
          <div className="flex flex-wrap justify-center lg:justify-start gap-[0.5rem] sm:gap-[1rem] py-[16px]">
            {streams.map((stream) => {
              return (
                <div
                  key={stream.id}
                  className="flex flex-col gap-[8px] w-[320px] sm:w-[240px]"
                >
                  <div
                    className="relative w-[320px] sm:w-[240px] h-[180px] sm:h-[135px] flex justify-center items-center rounded-lg bg-black hover:cursor-pointer"
                    onClick={() => {
                      router.push(`/livestream/${stream.roomId}`);
                    }}
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${stream?.thumbnail}`}
                      className="max-w-full max-h-full rounded-lg"
                      crossOrigin="anonymous"
                      alt="Avatar"
                    />
                  </div>
                  <div className="relative px-2">
                    <div className="text-ellipsis line-clamp-2 font-bold text-[1rem] break-words mr-6">
                      Test
                    </div>
                  </div>
                  <div className="flex flex-col w-[172px] text-grey-500 font-light px-2">
                    <div className="text-[0.75rem]">
                      <span className="text-grey-300 font-semibold">
                        {stream.description}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
