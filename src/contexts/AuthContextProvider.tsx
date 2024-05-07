import React, { createContext, FC, ReactNode, useContext, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { User } from "@/libs/types";
import { getAccessToken, setAccessToken } from "@/libs/helpers";
import { createAuthToken, verifyUser } from "@/services/auth";

export interface AuthContextState {
  user: User | null;
  setUser(user: User | null): void;
}

export const AuthContextContext = createContext<AuthContextState>(
  {} as AuthContextState
);

export function useAuthConnect(): AuthContextState {
  return useContext(AuthContextContext);
}

export const AuthContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { publicKey, disconnecting, signMessage, disconnect } = useWallet();

  return (
    <AuthContextContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContextContext.Provider>
  );
};
