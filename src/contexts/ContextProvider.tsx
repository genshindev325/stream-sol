"use client"; // This is a client component

import React, { FC, ReactNode, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";

/// Built-in
import { WalletError } from "@solana/wallet-adapter-base";
import { HuddleClient, HuddleProvider } from "@huddle01/react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";

/// Custom
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
import { NetworkConfigurationProvider } from "./NetworkConfigurationProvider";
import { RPC_ENDPOINT, HUDDLE_PROJECT_ID } from "@/libs/constants";

const huddleClient = new HuddleClient({
  projectId: HUDDLE_PROJECT_ID,
  options: {
    activeSpeakers: {
      size: 1,
    },
  },
});

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  return (
    <ConnectionProvider endpoint={RPC_ENDPOINT}>
      <WalletProvider
        wallets={wallets}
        onError={onError}
        autoConnect={autoConnect}
      >
        <ReactUIWalletModalProviderDynamic>
          {children}
        </ReactUIWalletModalProviderDynamic>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <NetworkConfigurationProvider>
        <AutoConnectProvider>
          <WalletContextProvider>
            <HuddleProvider client={huddleClient}>{children}</HuddleProvider>
          </WalletContextProvider>
        </AutoConnectProvider>
      </NetworkConfigurationProvider>
    </>
  );
};
