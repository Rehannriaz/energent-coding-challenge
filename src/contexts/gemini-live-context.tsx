"use client";

import { createContext, FC, ReactNode, useContext } from "react";
import { useGeminiLive, UseGeminiLiveResults } from "../hooks/use-gemini-live";
import { LiveClientOptions } from "../types/gemini";

const GeminiLiveContext = createContext<UseGeminiLiveResults | undefined>(undefined);

export type GeminiLiveProviderProps = {
  children: ReactNode;
  options: LiveClientOptions;
};

export const GeminiLiveProvider: FC<GeminiLiveProviderProps> = ({
  options,
  children,
}) => {
  const geminiLive = useGeminiLive(options);

  return (
    <GeminiLiveContext.Provider value={geminiLive}>
      {children}
    </GeminiLiveContext.Provider>
  );
};

export const useGeminiLiveContext = () => {
  const context = useContext(GeminiLiveContext);
  if (!context) {
    throw new Error("useGeminiLiveContext must be used within a GeminiLiveProvider");
  }
  return context;
};