"use client"; // This is a client component

import React, { useState, useEffect } from "react";
import Link from "next/link";

/// Built-in
import ReactPaginate from "react-paginate";
import { useWallet } from "@solana/wallet-adapter-react";

/// Custom
import {
  NoComponent,
  PageLoading,
  AvatarComponent,
  NoWallet,
} from "@/components/common";
import { ITEMS_PER_PAGE } from "@/libs/constants";
import { fetchFollowers } from "@/services/profile";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { User } from "@/libs/types";
import { follow } from "@/services/profile";

/// Images
import peoplePic from "@/assets/images/people.png";

type Follower = {
  followed: boolean;
  user: User;
};

export default function Followers({ profile }: { profile: User }) {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [followers, setFollowers] = useState<Array<Follower>>([]);
  const { user } = useAuthContext();

  const fetchData = async () => {
    if (publicKey) {
      setLoading(true);
      try {
        const data = await fetchFollowers(
          publicKey.toBase58(),
          profile.publickey,
          pageNum
        );
        setFollowers(data.followers);
        setPageCount(Math.ceil(data.count / ITEMS_PER_PAGE));
      } catch (err) {}
      setLoading(false);
    }
  };

  const doFollow = async (publickey: string) => {
    setLoading(true);
    try {
      const data = await follow(publickey);
      await fetchData();
    } catch (err: any) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [pageNum, publicKey]);

  if (!user) {
    return <NoWallet />;
  }

  return (
    <>
      {loading ? (
        <PageLoading />
      ) : pageCount === 0 ? (
        <NoComponent content="No Followers" source={peoplePic} />
      ) : (
        <>
          <div className="flex flex-col px-[16px] gap-[16px]">
            {followers.map((follower) => {
              return (
                <div
                  className="flex justify-between items-center"
                  key={follower.user.id}
                >
                  <Link
                    className="flex gap-[8px] hover:cursor-pointer"
                    href={`/profile/${follower.user.username}`}
                  >
                    <AvatarComponent avatar={user?.avatar} size={48} />
                    <div className="flex flex-col">
                      <div className="text-[18px]">
                        {follower.user.fullname}
                      </div>
                      <div className="text-[14px]">
                        {follower.user.followers === 0
                          ? "No"
                          : follower.user.followers}{" "}
                        followers
                      </div>
                    </div>
                  </Link>
                  <div
                    className={
                      "w-[120px] h-[40px] flex justify-center items-center hover:cursor-pointer" +
                      (follower.followed
                        ? " border border-[#AE7AFF] bg-white text-[#AE7AFF]"
                        : " bg-[#AE7AFF]")
                    }
                    onClick={() => {
                      doFollow(follower.user.publickey);
                    }}
                  >
                    {follower.followed ? "Unfollow" : "Follow"}
                  </div>
                </div>
              );
            })}
          </div>

          {pageCount > 1 && (
            <div className="flex justify-end mt-[24px] px-[16px]">
              <ReactPaginate
                previousLabel="<"
                nextLabel=">"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={(event: any) => {
                  setPageNum(event.selected);
                }}
                containerClassName="pagination"
                activeClassName="active"
                forcePage={pageNum}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
