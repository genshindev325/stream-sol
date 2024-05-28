"use client"; // This is a client component

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { LoadMore, PageLoading, NoComponent } from "@/components/common";
import { getAllLivestreams } from "@/services/livestream";
import { ITEMS_PER_PAGE } from "@/libs/constants";
import Streamtile from "@/components/home/Streamtile";

/// Images
import videoPic from "@/assets/images/video.png";

export default function Main() {
  const [pageNum, setPageNum] = useState(1);
  const [count, setCount] = useState(0);
  const [lives, setLives] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const { livestreams, count } = await getAllLivestreams(
        pageNum.toString(),
        search
      );
      console.log(">>Livestreams>>", livestreams, count);
      if (pageNum > 1) {
        setLives([...lives, ...livestreams]);
      } else {
        setLives(livestreams);
      }
      setCount(count);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const showMore = () => {
    const total = pageNum * ITEMS_PER_PAGE;

    if (total < count) {
      setPageNum(pageNum + 1);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [pageNum]);

  useEffect(() => {
    if (pageNum === 1) {
      fetchVideos();
    } else {
      setPageNum(1);
    }
  }, [search]);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="flex flex-1 flex-col p-[12px] sm:p-[16px]">
      {lives.length === 0 ? (
        <NoComponent content="No Livestream" source={videoPic} />
      ) : (
        <div className="flex flex-wrap justify-center md:justify-start gap-[0.5rem] sm:gap-[1rem] py-[16px]">
          {lives.map((livestream, idx) => {
            return <Streamtile key={idx} livestream={livestream} />;
          })}
        </div>
      )}
      {pageNum * ITEMS_PER_PAGE < count && <LoadMore showMore={showMore} />}
    </div>
  );
}
