import React, { useEffect, useState } from "react";

/// React icons
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";

/// Built-in Import
import toast from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";

/// Custom Import
import { LoadMore, NoComponent, PageLoading, NoWallet } from "../common";

/// Utils
import { formatTime } from "@/libs/helpers";
import { ITEMS_PER_PAGE } from "@/libs/constants";
import { AlikeEnum, User } from "@/libs/types";
import {
  createAnnouncement,
  fetchAnnouncements,
  doLikeAnnouncement,
  doDislikeAnnouncement,
} from "@/services/announcement";
import { Announcement as AnnouncementProps } from "@/libs/types";
import { useAuthContext } from "@/contexts/AuthContextProvider";

export default function Announcement({ profile }: { profile: User }) {
  const [content, setContent] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [count, setCount] = useState(1);
  const [announcements, setAnnouncements] = useState<Array<AnnouncementProps>>(
    []
  );
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();

  const showMore = () => {
    const total = pageNum * ITEMS_PER_PAGE;

    if (total < count) {
      setPageNum(pageNum + 1);
    }
  };

  const send = async () => {
    if (!publicKey) {
      toast.error("Connect your wallet", { duration: 3000 });
      return;
    }
    if (loading) {
      return;
    }
    if (content.length <= 0 || content.length > 200) {
      return;
    }

    setLoading(true);
    try {
      const data = await createAnnouncement(content);
      setAnnouncements([data, ...announcements]);
      setCount(count + 1);
      setContent("");
    } catch (err) {
      toast.error("Failed to create an announcement", { duration: 3000 });
    }
    setLoading(false);
  };

  const fetchData = async () => {
    const pk = publicKey?.toBase58()!;
    const data = await fetchAnnouncements(pk, profile.publickey, pageNum);
    setCount(data.count);

    if (pageNum === 1) {
      setAnnouncements(data.announcements);
    } else {
      setAnnouncements([...announcements, ...data.announcements]);
    }
  };

  const doLike = async (id: string) => {
    if (!publicKey) {
      toast.error("Connect your wallet", { duration: 3000 });
      return;
    }
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const data = await doLikeAnnouncement(id);
      if (pageNum === 1) {
        await fetchData();
      } else {
        setPageNum(1);
      }
    } catch (err) {}
    setLoading(false);
  };

  const doDislike = async (id: string) => {
    if (!publicKey) {
      toast.error("Connect your wallet", { duration: 3000 });
      return;
    }
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const data = await doDislikeAnnouncement(id);
      if (pageNum === 1) {
        await fetchData();
      } else {
        setPageNum(1);
      }
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    (async function () {
      setLoading(true);
      try {
        await fetchData();
      } catch (err) {}
      setLoading(false);
    })();
  }, [pageNum, profile, publicKey]);

  if (!user) {
    return <NoWallet />;
  }

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="flex flex-col flex-1 gap-4 text-[0.875rem] sm:text-[1rem]">
      {publicKey?.toBase58() === profile.publickey && (
        <div className="relative border border-grey-800 rounded-lg p-2">
          <textarea
            spellCheck={false}
            value={content}
            onChange={(e) => {
              const content = e.target.value;
              setContent(content);
            }}
            placeholder="Type here"
            className="text-grey-300 placeholder:text-grey-800 indent-2 h-[120px] w-full text-[0.875rem] sm:text-[1rem] bg-transparent border-none focus:outline-none focus:[box-shadow:none"
          />
          <div
            className="w-[80px] lg:w-[100px] h-[32px] lg:h-[36px] bg-primary-300 text-[0.875rem] sm:text-[1rem] rounded-md flex justify-center items-center hover:cursor-pointer absolute bottom-[12px] left-[12px]"
            onClick={send}
          >
            Submit
          </div>
        </div>
      )}
      {announcements.length === 0 ? (
        <NoComponent content="No Announcements" />
      ) : (
        announcements.map((announcement, idx) => {
          return (
            <div
              className="flex flex-col w-full py-[8px] text-grey-300"
              key={idx}
            >
              <div className="text-[0.875rem] sm:text-[1rem]">
                {profile.fullname}
                <span className="pl-[16px] text-[0.75rem] sm:text-[0.875rem] text-grey-500">
                  {formatTime(announcement.createdAt)}
                </span>
              </div>
              <div className="">{announcement.content}</div>
              <div className="mt-[8px] gap-[4px] flex items-center">
                {announcement.userLiked === AlikeEnum.Like ? (
                  <BiSolidLike
                    size={16}
                    className="hover:cursor-pointer"
                    onClick={() => {
                      doLike(announcement.id);
                    }}
                  />
                ) : (
                  <BiLike
                    size={16}
                    className="hover:cursor-pointer"
                    onClick={() => {
                      doLike(announcement.id);
                    }}
                  />
                )}
                <span>{announcement.likes}</span>

                {announcement.userLiked === AlikeEnum.Dislike ? (
                  <BiSolidDislike
                    size={16}
                    className="ml-[16px] hover:cursor-pointer"
                    onClick={() => {
                      doDislike(announcement.id);
                    }}
                  />
                ) : (
                  <BiDislike
                    size={16}
                    className="ml-[16px] hover:cursor-pointer"
                    onClick={() => {
                      doDislike(announcement.id);
                    }}
                  />
                )}
                <span>{announcement.dislikes}</span>
              </div>
            </div>
          );
        })
      )}
      {pageNum * ITEMS_PER_PAGE < count && <LoadMore showMore={showMore} />}
    </div>
  );
}
