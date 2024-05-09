"use client"; // This is a client component

import React, { useState, useEffect } from "react";
import Link from "next/link";

/// Icons
import { FaUserCircle } from "react-icons/fa";

/// Built-in
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useWallet } from "@solana/wallet-adapter-react";

/// Custom
import { NoComponent, PageLoading } from "@/components/common";
import { API_CONFIG, ITEMS_PER_PAGE } from "@/libs/constants";
import { getAccessToken } from "@/libs/helpers";

/// Images
import peoplePic from "@/assets/images/people.png";

export default function Followers() {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState<Array<any>>([]);
  const [pageNum, setPageNum] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [refetch, setRefetch] = useState(false);

  const handlePageClick = (event: any) => {
    setPageNum(event.selected);
  };

  const doFollow = async (pk: string) => {
    if (pk) {
      setLoading(true);
      try {
        const token = getAccessToken();
        const { data } = await axios.post(
          `${API_CONFIG}/follow`,
          { follower: pk },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        setRefetch((prev) => !prev);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      setLoading(true);
      const token = getAccessToken();
      axios
        .get(
          `${API_CONFIG}/follow/subscribe/${publicKey?.toBase58()}?page=${
            pageNum + 1
          }`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then(({ data }) => {
          if (data.success) {
            setPageCount(Math.ceil(data.count / ITEMS_PER_PAGE));
            setSubscribers(data.followers);
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [pageNum, publicKey, refetch]);

  return (
    <>
      {loading ? (
        <PageLoading />
      ) : pageCount === 0 ? (
        <NoComponent content="No Followers" source={peoplePic} />
      ) : (
        <>
          <div className="text-[32px] my-[16px] text-center sm:text-start font-bold">
            Your Followers
          </div>
          <div className="flex flex-col px-[16px] gap-[16px]">
            {subscribers.map((sub) => {
              return (
                <div
                  className="flex justify-between items-center"
                  key={sub._id}
                >
                  <Link
                    className="flex gap-[8px] hover:cursor-pointer"
                    href={`/profile/${sub.userDetails.username}`}
                  >
                    {sub.userDetails.avatar === "" ? (
                      <FaUserCircle size={50} />
                    ) : (
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${sub.userDetails.avatar}`}
                        className="w-[48px] h-[48px] rounded-full"
                        crossOrigin="anonymous"
                        alt="Avatar"
                      />
                    )}
                    <div className="flex flex-col">
                      <div className="text-[18px]">
                        {sub.userDetails.firstname +
                          " " +
                          sub.userDetails.lastname}
                      </div>
                      <div className="text-[14px]">
                        {sub.userDetails.subscribers === 0
                          ? "No"
                          : sub.userDetails.subscribers}{" "}
                        followers
                      </div>
                    </div>
                  </Link>
                  <div
                    className={
                      "w-[120px] h-[40px] flex justify-center items-center hover:cursor-pointer" +
                      (sub.followed
                        ? " border border-[#AE7AFF] bg-white text-[#AE7AFF]"
                        : " bg-[#AE7AFF]")
                    }
                    onClick={() => {
                      doFollow(sub.user);
                    }}
                  >
                    {sub.followed ? "Unfollow" : "Follow"}
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
                onPageChange={handlePageClick}
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
