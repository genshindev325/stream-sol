import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import { RiSendPlaneFill } from "react-icons/ri";
import { BsEmojiSmile } from "react-icons/bs";

import emojiData from "@emoji-mart/data";
import EmojiPicker from "@emoji-mart/react";
import { useDataMessage } from "@huddle01/react/hooks";

import MessageBubble from "./MessageBubble";
import { creatChat, getChatHistory } from "@/services/chat";
import { useAuthContext } from "@/contexts/AuthContextProvider";

export type TMessage = {
  text: string;
  sender: string;
  pfp: string;
};

type Props = {
  livestreamId: string;
};
function ChatBox({ livestreamId }: Props) {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [text, setText] = useState<string>("");
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const params = useParams<{ roomId: string }>();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthContext();

  const { sendData } = useDataMessage({
    onMessage: async (payload, from, label) => {
      if (label === "chat") {
        const sender = payload.split("00x0")[0] as string;
        const pfp = payload.split("00x0")[1] as string;
        const text = payload.split("00x0")[2] as string;
        setMessages((prev) => [
          ...prev,
          { text, pfp: pfp === "none" ? "" : pfp, sender },
        ]);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const { chatHistory } = await getChatHistory({ livestreamId });

      let allMessages = [];
      if (chatHistory) {
        allMessages = chatHistory.map((item: any) => {
          return {
            text: item.content,
            sender: item.sender,
            pfp: item?.pfp!,
          };
        });
      }
      setMessages(allMessages);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!user) {
      return;
    }
    try {
      const roomId = params.roomId;
      sendData({
        to: "*",
        payload:
          user.username + "00x0" + (user?.avatar || "none") + "00x0" + text,
        label: "chat",
      });
      const chat = await creatChat({
        roomId,
        sender: user.username,
        pfp: user?.avatar!,
        content: text,
      });
      setText("");
    } catch (err) {}
  };

  return (
    <div className="relative w-full xl:w-[280px] 2xl:w-[400px] bg-[#FFFFFF05] border border-grey-800 flex flex-col max-xl:h-[300px] h-[85vh] ">
      <h1 className="text-center text-2xl my-2 border-b border-grey-800">
        Chat Room
      </h1>
      <div
        ref={messagesContainerRef}
        className="flex flex-col gap-[4px] flex-1 p-2 border-b border-grey-800 overflow-y-auto break-all"
      >
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
      </div>
      {emojiPickerVisible && (
        <div className={"absolute right-[0px] bottom-[50px] z-10"}>
          <EmojiPicker
            data={emojiData}
            theme="dark"
            onClickOutside={() => {
              setEmojiPickerVisible(false);
            }}
            onEmojiSelect={(e: any) => {
              setText(text + e.native);
            }}
          />
        </div>
      )}

      <div className="flex p-1">
        <input
          type="text"
          className="self-end w-full bg-black text-white outline-none p-2 text-sm"
          placeholder="Type Message..."
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button
          className="m-1 justify-center"
          onClick={() => {
            setEmojiPickerVisible(!emojiPickerVisible);
            console.log(emojiPickerVisible);
          }}
        >
          <BsEmojiSmile size={"20px"} />
        </button>
        <button
          className="m-1 justify-center"
          onClick={() => {
            sendMessage();
          }}
        >
          <RiSendPlaneFill size={"20px"} />
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
