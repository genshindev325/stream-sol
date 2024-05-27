import { useDataMessage, useLocalPeer } from "@huddle01/react/hooks";
import { useState } from "react";
import LocalMessageBubble from "./LocalMessageBubble";
import RemoteMessageBubble from "./RemoteMessageBubble";
import { IoSend } from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";

export type TMessage = {
  text: string;
  sender: string;
};

function ChatBox() {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [text, setText] = useState<string>("");

  const { peerId } = useLocalPeer();
  const { sendData } = useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === "chat") {
        setMessages((prev) => [...prev, { text: payload, sender: from }]);
      }
    },
  });

  const sendMessage = () => {
    sendData({
      to: "*",
      payload: text,
      label: "chat",
    });
    setText("");
  };

  return (
    <div className="w-full xl:w-[400px] border border-grey-800 flex flex-col max-xl:h-[300px]">
      <h1 className="text-center text-2xl my-2 border-b border-grey-800">
        Chat Room
      </h1>
      <div className="flex-1 p-4 border-b border-grey-800">
        {messages.map((message, index) =>
          message.sender === peerId ? (
            <LocalMessageBubble key={index} message={message} />
          ) : (
            <RemoteMessageBubble key={index} message={message} />
          )
        )}
      </div>
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
