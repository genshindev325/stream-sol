import { useDataMessage, useLocalPeer } from "@huddle01/react/hooks";
import { useEffect, useRef, useState } from "react";
import LocalMessageBubble from "./LocalMessageBubble";
import RemoteMessageBubble from "./RemoteMessageBubble";
import { RiSendPlaneFill } from "react-icons/ri";
import emojiData from "@emoji-mart/data";
import EmojiPicker from "@emoji-mart/react";
import { BsEmojiSmile } from "react-icons/bs";
import { useParams } from "next/navigation";
import { TPeerMetadata } from "@/libs/types";
import { creatChat, getChatHistory } from "@/services/chat";
import { getLivestreamByRoomId } from "@/services/livestream";

export type TMessage = {
  text: string;
  sender: string;
};

function ChatBox() {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [text, setText] = useState<string>("");
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const params = useParams<{ roomId: string }>();
  const { metadata } = useLocalPeer<TPeerMetadata>();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { peerId } = useLocalPeer();
  const { sendData } = useDataMessage({
    onMessage: async (payload, from, label) => {
      if (label === "chat") {
        setMessages((prev) => [...prev, { text: payload, sender: from }]);
        const roomId = params.roomId;
        console.log(">>", roomId, from, payload);
        const chat = await creatChat({
          roomId,
          sender: from,
          content: payload,
        });
        console.log("Messages: ", messages);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const { livestream } = await getLivestreamByRoomId(params.roomId);
      const livestreamId = livestream.id;
      console.log(livestreamId);
      const { chatHistory } = await getChatHistory({ livestreamId });

      let allMessages = [];
      if (chatHistory) {
        allMessages = chatHistory.map((item: any) => {
          return {
            text: item?.content,
            sender: item?.sender,
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

  const sendMessage = () => {
    sendData({
      to: "*",
      payload: text,
      label: "chat",
    });
    setText("");
  };

  return (
    <div className="relative w-full xl:w-[400px] border border-grey-800 flex flex-col max-xl:h-[300px] h-[85vh]">
      <h1 className="text-center text-2xl my-2 border-b border-grey-800">
        Chat Room
      </h1>
      <div
        ref={messagesContainerRef}
        className="flex-1 p-4 border-b border-grey-800 overflow-y-scroll"
      >
        {messages.map((message, index) =>
          message.sender === peerId ? (
            <LocalMessageBubble key={index} message={message} />
          ) : (
            <RemoteMessageBubble key={index} message={message} />
          )
        )}
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
