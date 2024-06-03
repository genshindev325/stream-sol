"use client"; // This is a client component

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

/// React Icons
import { RiDeleteBinLine } from "react-icons/ri";

/// Built-in Modules
import ReactPaginate from "react-paginate";
import { useWallet } from "@solana/wallet-adapter-react";

/// Custom Import
import {
  NoComponent,
  NoWallet,
  PageLoading,
  VideoDelete,
} from "@/components/common";

/// Utils
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { fetchAllVideos } from "@/services/video";
import { formatTime } from "@/libs/helpers";
import type { Livestream } from "@/libs/types";
import { ITEMS_PER_PAGE } from "@/libs/constants";

/// Images
import videoPic from "@/assets/images/video.png";

export default function MyContent() {
  const [selectedDelete, setSelectedDelete] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [videos, setVideos] = useState<Array<Livestream>>([]);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const { publicKey } = useWallet();
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (publicKey) {
      (async function () {
        setLoading(true);
        try {
          const data = await fetchAllVideos({
            publicKey: publicKey.toBase58(),
            pageNum,
          });
          setVideos(data.videos);
          setPageCount(Math.ceil(data.count / ITEMS_PER_PAGE));
        } catch (err) {
          console.error(err);
        }
        setLoading(false);
      })();
    }
  }, [publicKey, pageNum, refetch, search]);

  const handlePageClick = (event: any) => {
    setPageNum(event.selected + 1);
  };

  if (loading) {
    return <PageLoading />;
  }

  if (!user) {
    return <NoWallet />;
  }

  return (
    <div className="flex flex-col flex-1 p-2 sm:p-4">
      <div className="my-[16px] pb-4 border-b border-1 border-solid border-[#FFFFFF0D] text-[1.5rem] sm:text-[2rem] font-bold">
        My Content
      </div>
      {videos.length === 0 ? (
        <NoComponent content="No Content" source={videoPic} />
      ) : (
        <>
          <div className="mt-0 sm:mt-6">
            <div className="flex gap-2 items-center w-full px-4 py-2 font-semibold text-[1rem]">
              <div className="w-[90%]">Content</div>
              <span className="w-[10%] text-center">Delete</span>
            </div>
            {videos.map((video, idx) => {
              return (
                <div
                  className="flex gap-2 items-center w-full px-4 py-2 border-t border-1 border-solid border-[#FFFFFF0D]"
                  key={idx}
                >
                  <div className="flex items-center gap-[8px] w-[90%]">
                    <div
                      className="relative w-[96px] sm:w-[160px] sm:min-w-[160px] h-[54px] sm:h-[90px] flex justify-center items-center rounded-lg bg-black hover:cursor-pointer"
                      onClick={() => {
                        router.push(`/video/${video.id}`);
                      }}
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${video.thumbnail}`}
                        className="max-w-full max-h-full rounded-lg"
                        crossOrigin="anonymous"
                        alt="Thumbnail"
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-full text-[0.875rem] sm:text-[1rem]">
                      <div className="text-ellipsis line-clamp-2">
                        {video.title}
                        <span className="text-[0.75rem] sm:text-[0.875rem] text-grey-700">
                          (
                          {video.archived
                            ? video.video === ""
                              ? "Not Archived"
                              : "Archived"
                            : "Live"}
                          )
                        </span>
                      </div>
                      <div className="text-grey-500 text-[0.75rem] sm:text-[0.875rem]">
                        {formatTime(video.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-2 w-[10%]">
                    <RiDeleteBinLine
                      size={20}
                      className="hover:cursor-pointer"
                      onClick={() => {
                        setSelectedDelete(video.id);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {pageCount > 1 && (
            <div className="flex justify-end mt-[24px]">
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
                forcePage={pageNum - 1}
              />
            </div>
          )}
        </>
      )}
      {selectedDelete !== "" && (
        <VideoDelete
          id={selectedDelete}
          onClose={() => {
            setSelectedDelete("");
          }}
          onRefetch={() => {
            setRefetch((prev) => !prev);
          }}
        />
      )}
    </div>
  );
}
