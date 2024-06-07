"use client"; // This is a client component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/// Built-in
import ReactPaginate from "react-paginate";

/// Custom
import { NoComponent, PageLoading, NoWallet } from "@/components/common";
import { ITEMS_PER_PAGE } from "@/libs/constants";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { Video, User } from "@/libs/types";
import { fetchArchivedVideos } from "@/services/video";

export default function Videos({ profile }: { profile: User }) {
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [videos, setVideos] = useState<Array<Video>>([]);
  const { user } = useAuthContext();
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchArchivedVideos({
        publicKey: profile.publickey,
        pageNum,
      });
      setVideos(data.videos);
      setPageCount(Math.ceil(data.count / ITEMS_PER_PAGE));
    } catch (err) {}
    setLoading(false);
  };

  const handlePageClick = (event: any) => {
    setPageNum(event.selected + 1);
  };

  useEffect(() => {
    fetchData();
  }, [pageNum]);

  if (!user) {
    return <NoWallet />;
  }

  return (
    <>
      {loading ? (
        <PageLoading />
      ) : pageCount === 0 ? (
        <NoComponent content="No Video" />
      ) : (
        <>
          <div className="flex flex-1 flex-col">
            <div className="flex flex-wrap justify-center lg:justify-start gap-[0.5rem] sm:gap-[1rem] py-[16px]">
              {videos.map((video) => {
                return (
                  <div
                    key={video.id}
                    className="flex flex-col gap-[8px] w-[320px] sm:w-[240px]"
                  >
                    <div
                      className="relative w-[320px] sm:w-[240px] h-[180px] sm:h-[135px] flex justify-center items-center rounded-lg bg-black hover:cursor-pointer"
                      onClick={() => {
                        const archievedstreamId = video.id;
                        router.push(`/video/${archievedstreamId}`);
                      }}
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${video?.thumbnail}`}
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
                          {video.description}
                        </span>
                      </div>
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
                  forcePage={pageNum - 1}
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
