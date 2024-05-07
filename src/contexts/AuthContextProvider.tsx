import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState,
} from "react";
import { User } from "@/libs/types";

export interface AuthContextState {
  user: User | null;
  setUser(user: User | null): void;
}

export const AuthContext = createContext<AuthContextState>(
  {} as AuthContextState
);

export function useAuthContext(): AuthContextState {
  return useContext(AuthContext);
}

export const AuthContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
