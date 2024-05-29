"use client"; // This is a client component

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { LoadMore, PageLoading, NoComponent } from "@/components/common";
import { getAllLivestreams } from "@/services/livestream";
import { ITEMS_PER_PAGE } from "@/libs/constants";
import Streamtile from "@/components/home/Streamtile";
import { useLivestreamsContext } from "@/contexts/LivestreamsContextProvider";

/// Images
import videoPic from "@/assets/images/video.png";

export default function Main() {
  const [pageNum, setPageNum] = useState(1);
  const [count, setCount] = useState(0);
  const [lives, setLives] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const { livestreams, setLivestreams } = useLivestreamsContext();

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const data = await getAllLivestreams(pageNum.toString(), search);
      console.log("Livestreams >>>>> ", data);
      if (pageNum > 1) {
        setLivestreams([...livestreams, ...data.livestreams]);
      } else {
        setLivestreams(data.livestreams);
      }
      setCount(data.count);
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

  if (lives.length === 0) {
    return <NoComponent content="No Livestream" source={videoPic} />;
  }

  return (
    <div className="flex flex-col flex-1 p-[12px] sm:p-[16px]">
      <div className="flex flex-wrap justify-center md:justify-start gap-[0.5rem] sm:gap-[1rem] py-[16px]">
        {lives.map((livestream, idx) => {
          return <Streamtile key={idx} livestream={livestream} />;
        })}
      </div>
      {pageNum * ITEMS_PER_PAGE < count && <LoadMore showMore={showMore} />}
    </div>
  );
}
