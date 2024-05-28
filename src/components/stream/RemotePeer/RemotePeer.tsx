import {
  useRemoteAudio,
  useRemoteScreenShare,
  useRemoteVideo,
} from "@huddle01/react/hooks";
import React, { useEffect, useRef } from "react";

type Props = {
  peerId: string;
};

const RemotePeer = ({ peerId }: Props) => {
  const { stream, state } = useRemoteVideo({ peerId });
  const { stream: audioStream, state: audioState } = useRemoteAudio({ peerId });
  const {
    videoStream: screenVideo,
    audioStream: screenAudio,
    state: screenState,
  } = useRemoteScreenShare({ peerId });
  const vidRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const screenAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    console.log("Remote Screen Video: ", screenVideo, screenState);
    if (screenVideo && screenVideoRef.current && screenState === "playable") {
      screenVideoRef.current.srcObject = screenVideo;

      screenVideoRef.current.onloadedmetadata = async () => {
        try {
          screenVideoRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      screenVideoRef.current.onerror = () => {
        console.error("videoCard() | Error is hapenning...");
      };
    }
  }, [screenVideo]);

  useEffect(() => {
    console.log("stream", stream, state);
    if (stream && vidRef.current && state === "playable") {
      vidRef.current.srcObject = stream;

      vidRef.current.onloadedmetadata = async () => {
        try {
          vidRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      vidRef.current.onerror = () => {
        console.error("videoCard() | Error is hapenning...");
      };
    }
  }, [stream]);

  useEffect(() => {
    if (audioStream && audioRef.current && audioState === "playable") {
      audioRef.current.srcObject = audioStream;

      audioRef.current.onloadedmetadata = async () => {
        try {
          audioRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      audioRef.current.onerror = () => {
        console.error("videoCard() | Error is hapenning...");
      };
    }
  }, [audioStream]);

  useEffect(() => {
    if (screenAudio && screenAudioRef.current) {
      screenAudioRef.current.srcObject = screenAudio;

      screenAudioRef.current.onloadedmetadata = async () => {
        try {
          screenAudioRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      screenAudioRef.current.onerror = () => {
        console.error("videoCard() | Error is hapenning...");
      };
    }
  }, [screenAudio]);

  return (
    <>
      {screenVideo ? (
        <video
          ref={screenVideoRef}
          autoPlay
          muted
          className="aspect-video rounded-xl lg:w-[800px]"
        />
      ) : (
        <video
          ref={screenVideoRef}
          className="aspect-video rounded-xl lg:w-[800px] border-white border-2 bg-slate-500"
          autoPlay
          muted
        />
      )}

      {stream && (
        <div className="w-1/4 mx-auto absolute right-[1rem] bottom-[1rem]">
          <video
            ref={vidRef}
            className="border-2 rounded-xl border-white-400 aspect-video"
            autoPlay
            muted
          />
        </div>
      )}

      <audio ref={audioRef} autoPlay></audio>
      {screenAudio && <audio ref={screenAudioRef} autoPlay></audio>}
    </>
  );
};

export default React.memo(RemotePeer);