import { useRouter } from "next/navigation";
import { TMessage } from "./ChatBox";
import { AvatarComponent } from "@/components/common";

interface Props {
  message: TMessage;
}

export default function MessageBubble({ message }: Props) {
  const router = useRouter();

  return (
    <div className="w-full items-start flex flex-col gap-[4px] text-sm">
      <div
        className="flex justify-center gap-[4px] hover:cursor-pointer"
        onClick={() => {
          router.push(`/profile/${message.sender}`);
        }}
      >
        <AvatarComponent avatar={message.pfp} size={18} />
        <span className="text-gray-300">{message.sender}</span>
      </div>
      <span className="text-gray-500 ml-[8px]">{message.text}</span>
    </div>
  );
}
