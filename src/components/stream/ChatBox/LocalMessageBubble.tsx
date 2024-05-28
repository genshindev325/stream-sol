import { TPeerMetadata } from "@/libs/types";
import { useLocalPeer } from "@huddle01/react/hooks";
import { TMessage } from "./ChatBox";

interface Props {
  message: TMessage;
}

function LocalMessageBubble({ message }: Props) {
  const { metadata } = useLocalPeer<TPeerMetadata>();

  return (
    <div className="w-full items-start flex flex-col bg-black rounded-lg">
      <span className="text-white bg-gray-900">{metadata?.displayName}</span>
      <span className="text-gray-500 text-sm">{message.text}</span>
    </div>
  );
}

export default LocalMessageBubble;
