"use client"; // This is a client component

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import axios from "axios";

import { LoadMore, FullLoading, PageLoading } from "@/components/common";
import { getAllLivestreams } from "@/services/livestream";
import { ITEMS_PER_PAGE } from "@/libs/constants";
import Streamtile from "@/components/home/Streamtile";

export default function Main() {
  const [pageNum, setPageNum] = useState(1);
  const [count, setCount] = useState(0);
  const [category, setCategory] = useState("all");
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
  }, [search, category]);

  useEffect(() => {
    if (lives.length > ITEMS_PER_PAGE) {
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      window.scrollTo(0, documentHeight - windowHeight - 400);
    }
  }, [lives]);

  return (
    <>
      {loading ? (
        <PageLoading />
      ) : (
        <div className="flex flex-1 flex-col p-[12px] sm:p-[16px]">
          <div className="flex flex-wrap justify-center md:justify-start gap-[0.5rem] sm:gap-[1rem] py-[16px]">
            {lives.map((livestream) => {
              return <Streamtile livestream={livestream} />;
            })}
          </div>
          {pageNum * ITEMS_PER_PAGE < count && <LoadMore showMore={showMore} />}
        </div>
      )}
    </>
  );
}
