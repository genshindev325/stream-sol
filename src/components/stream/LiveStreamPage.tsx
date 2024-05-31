"use client"; // This is a client component

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
  useDataMessage,
} from "@huddle01/react/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/// Built-in
import { Role } from "@huddle01/server-sdk/auth";
import toast from "react-hot-toast";

/// Icons
import { FaDollarSign, FaWindowClose } from "react-icons/fa";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import {
  AiFillCamera,
  AiOutlineAudio,
  AiOutlineAudioMuted,
  AiOutlineCamera,
} from "react-icons/ai";

/// Custom
import {
  endLivestream,
  increaseViews,
  decreaseViews,
  startRecording,
  stopRecording,
} from "@/services/livestream";
import { getRoomAccessToken } from "@/services/room";
import { createVideo } from "@/services/video";
import { FullLoading, AvatarComponent, DonateModal } from "../common";
import useKeyboardStatus from "@/hooks/useKeyboardStatus";
import { useAuthContext } from "@/contexts/AuthContextProvider";

type Props = {
  livestreamData: Livestream;
};

export default function LiveStreamPage({ livestreamData }: Props) {
  const [displayName, setDisplayName] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [joining, setJoining] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const { user } = useAuthContext();
  const router = useRouter();
  const [donated, setDonated] = useState<boolean>(false);
  const keyboardHeight = useKeyboardStatus();

  const { joinRoom, state, closeRoom, leaveRoom } = useRoom({
    onJoin: async (room) => {
      try {
        const response = await increaseViews(livestreamData.roomId);
        updateMetadata({ displayName });
      } catch (err) {}
    },
  });

  const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();
  const { startScreenShare, stopScreenShare, shareStream } =
    useLocalScreenShare();

  const { role, updateMetadata, metadata } = useLocalPeer<TPeerMetadata>();

  // const { peerIds } = usePeerIds({
  //   roles: [Role.HOST, Role.LISTENER],
  // });

  const { peerIds: hostPeerIds } = usePeerIds({
    roles: [Role.HOST],
  });

  useDataMessage({
    async onMessage(payload, from, label) {
      if (label === "server-message") {
        const { s3URL } = JSON.parse(payload);
        console.log(`Your recording: ${s3URL}`);
        try {
          const video = await createVideo({
            title: livestreamData.title,
            description: livestreamData?.description!,
            thumbnail: livestreamData.thumbnail,
            url: s3URL,
          });
          console.log(video);
        } catch (err) {
          console.log(err);
        }
      }
    },
  });

  useEffect(() => {
    return () => {
      leaveStream();
    };
  }, []);

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

  useEffect(() => {
    if (state == "closed") {
      if (role != Role.HOST) {
        toast.success("This livestream has been closed!", { duration: 3000 });
      }
      router.push(`/`);
    }
  }, [state]);

  const joinStream = async () => {
    const roomId = livestreamData.roomId;
    if (!user) {
      toast.error("Connect your wallet", { duration: 3000 });
      return;
    }
    if (joining) {
      return;
    }
    setJoining(true);
    try {
      const token = await getRoomAccessToken({
        roomId,
        publicKey: user.publickey,
      });
      setDisplayName(user.username);
      await joinRoom({
        roomId,
        token,
      });

      if (!livestreamData.recording) {
        await startRecording(livestreamData.roomId);
        setIsRecording(true);
      }
    } catch (error) {
      console.log(error);
    }
    setJoining(false);
  };

  const endStream = async () => {
    setLoading(true);
    let data: any;
    if (livestreamData.recording || isRecording) {
      try {
        const status = await stopRecording(livestreamData.roomId);
        data = await status.data;
        console.log("Recording URL >>>>>>>>>>>>>>>>> \n", data);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await endLivestream(livestreamData.roomId);
      closeRoom();
      router.push(`/profile/${user?.username}?tab=videos`);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const leaveStream = async () => {
    try {
      leaveRoom();
      await decreaseViews(livestreamData.roomId);
    } catch (err) {
      console.log(err);
    }
  };

  const handleVideo = async () => {
    try {
      if (isVideoOn) {
        await disableVideo();
      } else {
        await enableVideo();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAudio = async () => {
    try {
      if (isAudioOn) {
        await disableAudio();
      } else {
        await enableAudio();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleScreen = async () => {
    try {
      if (shareStream) {
        await stopScreenShare();
      } else {
        await startScreenShare();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {loading && <FullLoading />}
      {state === "idle" || state === "left" ? (
        <div className="flex justify-center flex-1">
          <div
            className="w-[220px] h-[60px] flex justify-center items-center hover:cursor-pointer bg-primary-300 text-white text-lg rounded-lg my-auto"
            onClick={joinStream}
          >
            {joining ? "Joining..." : "Go to Livestream"}
          </div>
        </div>
      ) : (
        <div
          className={`flex max-xl:flex-col gap-[16px] mx-auto mb-[${
            32 + keyboardHeight
          }px] sm:mb-[48px] p-[10px] sm:p-[16px]`}
        >
          <div className="flex flex-col grow gap-[16px] sm:mx-[12px] my-[12px]">
            {role == Role.HOST ? (
              <>
                <div className="mx-auto relative aspect-video rounded-xl w-[356px] sm:w-[560px] md:w-[432px] lg:w-[704px] xl:w-[640px] 2xl:w-[768px] bg-grey-700">
                  {shareStream && (
                    <video
                      ref={screenRef}
                      className="aspect-video rounded-xl w-full"
                      controls
                      autoPlay
                      muted
                    />
                  )}

                  {isVideoOn && (
                    <div className="w-1/4 mx-auto absolute right-[0.25rem] bottom-[0.25rem]">
                      <video
                        ref={videoRef}
                        className="aspect-video rounded-xl"
                        autoPlay
                        muted
                      />
                    </div>
                  )}
                </div>

                <div className="z-10 max-w-20xl w-full items-center justify-center font-mono text-[1.5rem] lg:flex">
                  <div className="flex justify-center">
                    {state === "connected" && (
                      <>
                        <button
                          type="button"
                          className="bg-blue-500 p-2 mx-2 rounded-lg"
                          onClick={handleVideo}
                        >
                          {isVideoOn ? <AiFillCamera /> : <AiOutlineCamera />}
                        </button>
                        <button
                          type="button"
                          className="bg-blue-500 p-2 mx-2 rounded-lg"
                          onClick={handleAudio}
                        >
                          {isAudioOn ? (
                            <AiOutlineAudio />
                          ) : (
                            <AiOutlineAudioMuted />
                          )}
                        </button>
                        <button
                          type="button"
                          className="bg-blue-500 p-2 mx-2 rounded-lg"
                          onClick={handleScreen}
                        >
                          {shareStream ? (
                            <LuScreenShareOff />
                          ) : (
                            <LuScreenShare />
                          )}
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 p-2 mx-2 rounded-lg"
                          onClick={endStream}
                        >
                          <FaWindowClose />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : hostPeerIds.length > 0 ? (
              <RemotePeer peerId={hostPeerIds[0]} />
            ) : (
              <div className="mx-auto aspect-video rounded-xl w-[368px] sm:w-[560px] md:w-[432px] lg:w-[704px] xl:w-[640px] 2xl:w-[768px] bg-grey-700" />
            )}

            <div className="text-[1.25rem] sm:text-[1.5rem] break- font-semibold">
              {livestreamData.title}
            </div>
            <div className="flex flex-row justify-between gap-4 mt-4">
              <div className="flex gap-2 hover:cursor-pointer">
                <AvatarComponent
                  avatar={livestreamData.creator?.avatar!}
                  size={44}
                />
                <div className="flex flex-col gap-[4px]">
                  <div className="text-[0.875rem] sm:text-[1rem] text-grey-300">
                    {livestreamData.creator.username}
                  </div>
                  <div className="flex justify-center items-center text-[0.75rem] sm:text-[0.875rem] text-grey-500 font-light bg-grey-700 rounded-xl px-[4px]">
                    <a href={livestreamData.link} target="_blank">
                      {livestreamData.text}
                    </a>
                  </div>
                </div>
              </div>
              {user?.publickey !== livestreamData.creator.publickey && (
                <div
                  className="bg-white text-BG text-black w-[120px] xl:w-[140px] h-[36px] xl:h-[48px] text-[0.875rem] sm:text-[1rem] rounded-lg flex justify-center items-center hover:cursor-pointer font-bold"
                  onClick={() => {
                    setDonated(true);
                  }}
                >
                  <FaDollarSign />
                  Donate
                </div>
              )}
            </div>
            <div className="text-grey-300 bg-[#FFFFFF05] p-4 border border-grey-800 rounded-lg mt-4">
              {livestreamData?.description ? (
                <>
                  <div className="text-[1.25rem] sm:text-[1.5rem] break- font-semibold">
                    Description
                  </div>
                  <div className="overflow-y-scroll">
                    {livestreamData?.description}
                  </div>
                </>
              ) : (
                "No description"
              )}
            </div>
          </div>
          <ChatBox livestreamId={livestreamData.id}/>
        </div>
      )}
      {donated && (
        <DonateModal
          pk={livestreamData.creator.publickey}
          name={livestreamData.creator.fullname}
          username={livestreamData.creator.username}
          avatar={livestreamData.creator.avatar!}
          onClose={() => {
            setDonated(false);
          }}
        />
      )}
    </>
  );
}
