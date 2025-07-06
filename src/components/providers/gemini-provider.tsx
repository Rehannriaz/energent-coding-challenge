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
    // Provide a dummy context during loading to prevent hook errors
    const dummyOptions: LiveClientOptions = {
      apiKey: "loading",
    };
    return (
      <GeminiLiveProvider options={dummyOptions}>
        {children}
      </GeminiLiveProvider>
    );
  }
  
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set on backend. Gemini features will be disabled.");
    // Provide a dummy API key to keep the provider structure, but it won't work
    const dummyOptions: LiveClientOptions = {
      apiKey: "dummy-key",
    };
    return (
      <GeminiLiveProvider options={dummyOptions}>
        {children}
      </GeminiLiveProvider>
    );
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