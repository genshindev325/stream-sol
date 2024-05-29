import React, {
    createContext,
    FC,
    ReactNode,
    useContext,
    useState,
  } from "react";
  import { Livestream } from "@/libs/types";
  
  export interface LivestreamsContextState {
    livestreams: Livestream[];
    setLivestreams(livestreams: Livestream[]): void;
  }
  
  export const LivestreamsContext = createContext<LivestreamsContextState>(
    {} as LivestreamsContextState
  );
  
  export function useLivestreamsContext(): LivestreamsContextState {
    return useContext(LivestreamsContext);
  }
  
  export const LivestreamsContextProvider: FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [livestreams, setLivestreams] = useState<Livestream[]>([]);
  
    return (
      <LivestreamsContext.Provider value={{ livestreams, setLivestreams }}>
        {children}
      </LivestreamsContext.Provider>
    );
  };
  