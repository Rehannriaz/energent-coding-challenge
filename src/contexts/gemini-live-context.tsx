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
    // Return a dummy context to prevent errors during loading or when provider is missing
    console.warn("GeminiLiveContext not found. This might be during loading or missing provider.");
    return {
      client: null,
      setConfig: () => {},
      config: {},
      model: "",
      setModel: () => {},
      connected: false,
      connect: async () => {
        console.warn("Gemini Live client not available");
      },
      disconnect: async () => {},
      volume: 0,
    };
  }
  return context;
};