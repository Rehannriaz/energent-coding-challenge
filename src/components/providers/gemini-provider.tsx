"use client";

import { ReactNode, useEffect, useState } from "react";
import { GeminiLiveProvider } from "../../contexts/gemini-live-context";
import { LiveClientOptions } from "../../types/gemini";

interface GeminiProviderProps {
  children: ReactNode;
}

export function GeminiProvider({ children }: GeminiProviderProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch API key from backend
    fetch('/api/ai')
      .then(res => res.json())
      .then(data => {
        if (data.apiKey) {
          setApiKey(data.apiKey);
        } else {
          console.warn("API key not available from backend");
        }
      })
      .catch(error => {
        console.error("Failed to fetch API key:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <>{children}</>;
  }
  
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set on backend. Gemini features will be disabled.");
    return <>{children}</>;
  }

  const apiOptions: LiveClientOptions = {
    apiKey,
  };

  return (
    <GeminiLiveProvider options={apiOptions}>
      {children}
    </GeminiLiveProvider>
  );
}