import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GenAILiveClient } from "../lib/gemini/genai-live-client";
import { LiveClientOptions } from "../types/gemini";
import { AudioStreamer } from "../lib/gemini/audio-streamer";
import { audioContext } from "../lib/gemini/utils";
import VolMeterWorket from "../lib/gemini/worklets/vol-meter";
import { LiveConnectConfig } from "@google/genai";
import { AudioWorkletEvent } from "../types/audio";

export type UseGeminiLiveResults = {
  client: GenAILiveClient;
  setConfig: (config: LiveConnectConfig) => void;
  config: LiveConnectConfig;
  model: string;
  setModel: (model: string) => void;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  volume: number;
};

export function useGeminiLive(options: LiveClientOptions): UseGeminiLiveResults {
  const client = useMemo(() => new GenAILiveClient(options), [options]);
  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  const [model, setModel] = useState<string>("models/gemini-2.0-flash-exp");
  const [config, setConfig] = useState<LiveConnectConfig>({
    generationConfig: {
      candidateCount: 1,
      maxOutputTokens: 1000,
    },
  });
  const [connected, setConnected] = useState(false);
  const [volume, setVolume] = useState(0);

  // register audio for streaming server -> speakers
  useEffect(() => {
    if (!audioStreamerRef.current && typeof window !== "undefined") {
      audioContext({ id: "audio-out" })
        .then((audioCtx: AudioContext) => {
          audioStreamerRef.current = new AudioStreamer(audioCtx);
          audioStreamerRef.current
            .addWorklet("vumeter-out", VolMeterWorket, (ev: MessageEvent) => {
              setVolume((ev as AudioWorkletEvent).data.volume);
            })
            .then(() => {
              // Successfully added worklet
            })
            .catch((error) => {
              console.warn("Failed to add audio worklet:", error);
            });
        })
        .catch((error) => {
          console.warn("Failed to initialize audio context:", error);
        });
    }
  }, [audioStreamerRef]);

  useEffect(() => {
    const onOpen = () => {
      setConnected(true);
    };

    const onClose = () => {
      setConnected(false);
    };

    const onError = (error: ErrorEvent) => {
      console.error("Gemini Live error:", error);
    };

    const stopAudioStreamer = () => audioStreamerRef.current?.stop();

    const onAudio = (data: ArrayBuffer) =>
      audioStreamerRef.current?.addPCM16(new Uint8Array(data));

    client
      .on("error", onError)
      .on("open", onOpen)
      .on("close", onClose)
      .on("interrupted", stopAudioStreamer)
      .on("audio", onAudio);

    return () => {
      client
        .off("error", onError)
        .off("open", onOpen)
        .off("close", onClose)
        .off("interrupted", stopAudioStreamer)
        .off("audio", onAudio)
        .disconnect();
    };
  }, [client]);

  const connect = useCallback(async () => {
    try {
      if (!config) {
        throw new Error("config has not been set");
      }
      
      // Check if we have a valid API key
      if (!options.apiKey || options.apiKey === "dummy-key" || options.apiKey === "loading") {
        console.warn("Cannot connect: Invalid or missing API key");
        return;
      }
      
      client.disconnect();
      await client.connect(model, config);
    } catch (error) {
      console.error("Failed to connect to Gemini Live:", error);
      setConnected(false);
    }
  }, [client, config, model, options.apiKey]);

  const disconnect = useCallback(async () => {
    client.disconnect();
    setConnected(false);
  }, [setConnected, client]);

  return {
    client,
    config,
    setConfig,
    model,
    setModel,
    connected,
    connect,
    disconnect,
    volume,
  };
}