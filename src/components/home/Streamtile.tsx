import { useRouter } from "next/navigation";
import { AvatarComponent } from "../common";
import { Livestream } from "@/libs/types";
import { formatK, formatTime } from "@/libs/helpers";
import { GATEWAY_URL } from "@/libs/constants";

type Props = {
  livestream: Livestream;
};

export default function Home({ livestream }: Props) {
  const router = useRouter();
  return (
    <div
      className="flex flex-col gap-[8px] w-[320px] sm:w-[240px hover:cursor-pointer"
      onClick={() => {
        router.push(`/livestream/${livestream.roomId}`);
      }}
    >
      <div className="relative w-[320px] sm:w-[240px] h-[180px] sm:h-[135px] flex justify-center items-center rounded-lg bg-black hover:cursor-pointer">
        <img
          src={`${GATEWAY_URL}/ipfs/${livestream.thumbnail}`}
          className="max-w-full max-h-full rounded-lg"
          crossOrigin="anonymous"
          alt="Avatar"
        />
      </div>
      <div className="relative px-2">
        <div className="text-ellipsis line-clamp-2 font-bold text-[1rem] break-words mr-6">
          {livestream.title}
        </div>
      </div>
      <div className="flex gap-4 px-2 hover:cursor-pointer">
        <div className="rounded-full max-w-[44px] w-[44px] h-[44px]">
          <AvatarComponent avatar={livestream.creator?.avatar} size={44} />
        </div>
        <div className="flex flex-col w-[172px] text-grey-500 font-light">
          <div className="text-[0.75rem]">
            <span className="text-grey-300 font-semibold">
              {livestream.creator.username}
            </span>
            <div className="hidden sm:block">
              <span className="mr-1">
                {formatK(livestream.views)} participants
              </span>
              •<span className="ml-1">{formatTime(livestream.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
