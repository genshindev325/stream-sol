"use client"; // This is a client component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/// Built-in
import ReactPaginate from "react-paginate";

/// Custom
import { NoComponent, PageLoading } from "@/components/common";
import { ITEMS_PER_PAGE } from "@/libs/constants";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { Archievedstream, User } from "@/libs/types";

/// Images
import videoPic from "@/assets/images/video.png";
import { fetchArchievedstreams } from "@/services/archievedstream";

export default function Videos({ profile }: { profile: User }) {
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageNum, setPageNum] = useState("1");
  const [videos, setVideos] = useState<Array<Archievedstream>>([]);
  const { user } = useAuthContext();
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchArchievedstreams({
        publicKey: profile.publickey,
        pageNum: pageNum,
      });
      setVideos(data.archievedstreams);
      setPageCount(Math.ceil(data.count / ITEMS_PER_PAGE));
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [pageNum]);

  if (!user) {
    return <NoComponent content="Connect Your Wallet" source={videoPic} />;
  }

  return (
    <>
      {loading ? (
        <PageLoading />
      ) : pageCount === 0 ? (
        <NoComponent content="No Videos" source={videoPic} />
      ) : (
        <>
          <div className="flex flex-1 flex-col p-[12px] sm:p-[16px]">
            <div className="flex flex-wrap justify-between md:justify-start gap-[0.5rem] sm:gap-[1rem] py-[16px]">
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
                  onPageChange={(event: any) => {
                    setPageNum(event.selected);
                  }}
                  containerClassName="pagination"
                  activeClassName="active"
                  forcePage={parseInt(pageNum, 10)}
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
