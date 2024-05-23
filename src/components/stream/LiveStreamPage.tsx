"use client";

import RemotePeer from "./RemotePeer/RemotePeer";
import ChatBox from "./ChatBox/ChatBox";
import { Livestream, TPeerMetadata } from "@/libs/types";
import {
  useLocalAudio,
  useLocalPeer,
  useLocalScreenShare,
  useLocalVideo,
  usePeerIds,
  useRoom,
} from "@huddle01/react/hooks";
import { Inter } from "next/font/google";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  token: string;
};

export default function Home({ token }: Props) {
  const [displayName, setDisplayName] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const params = useParams<{ roomId: string }>();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [livestreamData, setLivestreamData] = useState<Livestream>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getLivestreamByRoomId(params.roomId);
      console.log(">>>>>", data);
      setLivestreamData(data.livestream);
    };

    fetchData();
  }, [params]);

  const { joinRoom, state } = useRoom({
    onJoin: (room) => {
      console.log("onJoin", room);
      updateMetadata({ displayName });
    },
    onPeerJoin: (peer) => {
      console.log("onPeerJoin", peer);
    },
  });
  const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();
  const { startScreenShare, stopScreenShare, shareStream } =
    useLocalScreenShare();
  const { updateMetadata } = useLocalPeer<TPeerMetadata>();
  const { peerIds } = usePeerIds();

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (shareStream && screenRef.current) {
      screenRef.current.srcObject = shareStream;
    }
  }, [shareStream]);

  return (
    <main className={`flex flex-col items-center ${inter.className}`}>
      <div className="w-full flex justify-between items-stretch">
        <div className="flex-1 justify-between items-center flex flex-col m-[10px]">
          {shareStream && (
            <div className="mx-auto relative">
              <video
                ref={screenRef}
                className="aspect-video rounded-xl lg:w-[800px]"
                autoPlay
                muted
              />
              {isVideoOn && (
                <div className="w-1/4 mx-auto absolute right-[1rem] bottom-[1rem]">
                  <video
                    ref={videoRef}
                    className="aspect-video rounded-xl"
                    autoPlay
                    muted
                  />
                </div>
              )}
            </div>
          )}
          <div className="z-10 m-5 max-w-20xl w-full items-center justify-center font-mono text-[1.5rem] lg:flex">
            {/* <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                <code className="font-mono font-bold">{state}</code>
              </p> */}
            <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
              {state === "idle" && (
                <>
                  <input
                    disabled={state !== "idle"}
                    placeholder="Display Name"
                    type="text"
                    className="border-2 border-blue-400 rounded-lg p-2  mx-2 bg-black text-white"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                  />

                  <button
                    disabled={!displayName}
                    type="button"
                    className="bg-blue-500 p-2 mx-2 rounded-lg"
                    onClick={async () => {
                      console.log(params.roomId, token);
                      await joinRoom({
                        roomId: params.roomId as string,
                        token,
                      });
                    }}
                  >
                    Join Room
                  </button>
                </>
              )}

              {state === "connected" && (
                <>
                  <button
                    type="button"
                    className="bg-blue-500 p-2 mx-2 rounded-lg"
                    onClick={async () => {
                      isVideoOn ? await disableVideo() : await enableVideo();
                    }}
                  >
                    {isVideoOn ? <AiFillCamera /> : <AiOutlineCamera />}
                  </button>
                  <button
                    type="button"
                    className="bg-blue-500 p-2 mx-2 rounded-lg"
                    onClick={async () => {
                      isAudioOn ? await disableAudio() : await enableAudio();
                    }}
                  >
                    {isAudioOn ? <AiOutlineAudioMuted /> : <AiOutlineAudio />}
                  </button>
                  <button
                    type="button"
                    className="bg-blue-500 p-2 mx-2 rounded-lg"
                    onClick={async () => {
                      shareStream
                        ? await stopScreenShare()
                        : await startScreenShare();
                    }}
                  >
                    {shareStream ? <LuScreenShareOff /> : <LuScreenShare />}
                  </button>
                  <button
                    type="button"
                    className="bg-blue-500 p-2 mx-2 rounded-lg"
                    onClick={async () => {
                      const status = isRecording
                        ? await fetch(
                            `/api/stopRecording?roomId=${params.roomId}`
                          )
                        : await fetch(
                            `/api/startRecording?roomId=${params.roomId}`
                          );

                      const data = await status.json();
                      console.log({ data });
                      setIsRecording(!isRecording);
                    }}
                  >
                    {isRecording ? <FaStop /> : <HiMiniPlayPause />}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="">{livestreamData?.title}</div>

          <div className="mt-8 mb-32 grid gap-2 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
            {peerIds.map((peerId) =>
              peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null
            )}
          </div>
        </div>

        {state === "connected" && <ChatBox />}
      </div>
    </main>
  );
}

import { GetServerSidePropsContext } from "next";
import { getRoomAccessToken } from "@/services/room";
import {
  AiFillCamera,
  AiOutlineAudio,
  AiOutlineAudioMuted,
  AiOutlineCamera,
  AiOutlineVideoCamera,
} from "react-icons/ai";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { HiMiniPlayPause } from "react-icons/hi2";
import { FaStop } from "react-icons/fa";
import { getLivestreamByRoomId } from "@/services/livestream";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const roomId = ctx.params?.roomId?.toString() || "";
  const roomAccessToken = await getRoomAccessToken({ roomId });

  const token = await roomAccessToken.toJwt();

  return {
    props: { token },
  };
};
