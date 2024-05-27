import { TPeerMetadata } from "@/libs/types";
import { useRemotePeer } from "@huddle01/react/hooks";
import { TMessage } from "./ChatBox";

interface Props {
  message: TMessage;
}

function RemoteMessageBubble({ message }: Props) {
  const { metadata } = useRemotePeer<TPeerMetadata>({
    peerId: message.sender,
  });

  return (
    <div className="items-start flex flex-col break-all">
      <span className="text-white bg-gray-900">{metadata?.displayName}</span>
      <span className="text-gray-500 text-sm">{message.text}</span>
    </div>
  );
}

export default RemoteMessageBubble;
