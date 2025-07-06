import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackendGeminiClient } from "../lib/gemini/backend-client";
import { AudioStreamer } from "../lib/gemini/audio-streamer";

export type UseBackendGeminiResults = {
  client: BackendGeminiClient;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  volume: number;
};

export function useBackendGemini(): UseBackendGeminiResults {
  const client = useMemo(() => new BackendGeminiClient(), []);
  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  const [connected, setConnected] = useState(false);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (!audioStreamerRef.current) {
      const audioCtx = new AudioContext();
      audioStreamerRef.current = new AudioStreamer(audioCtx);
    }
  }, []);

  useEffect(() => {
    const onConnected = () => {
      setConnected(true);
    };

    const onDisconnected = () => {
      setConnected(false);
    };

    const onError = (error: string) => {
      console.error("Backend Gemini error:", error);
    };

    const _stopAudioStreamer = () => audioStreamerRef.current?.stop();

    const onAudio = (data: ArrayBuffer) =>
      audioStreamerRef.current?.addPCM16(new Uint8Array(data));

    const onVolume = (vol: number) => setVolume(vol);

    client
      .on("error", onError)
      .on("connected", onConnected)
      .on("disconnected", onDisconnected)
      .on("audio", onAudio)
      .on("volume", onVolume);

    return () => {
      client
        .off("error", onError)
        .off("connected", onConnected)
        .off("disconnected", onDisconnected)
        .off("audio", onAudio)
        .off("volume", onVolume);
      
      client.disconnect();
    };
  }, [client]);

  const connect = useCallback(async () => {
    await client.connect();
  }, [client]);

  const disconnect = useCallback(async () => {
    await client.disconnect();
    setConnected(false);
  }, [client]);

  return {
    client,
    connected,
    connect,
    disconnect,
    volume,
  };
}