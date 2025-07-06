import { EventEmitter } from "eventemitter3";
import {
  BackendMessage,
  GeminiMessageData,
  MessagePart,
  AudioPart,
} from "@/types/backend";
import { AIContentData } from "@/types/ai";

export interface BackendClientEventTypes {
  connected: () => void;
  disconnected: () => void;
  content: (data: AIContentData) => void;
  audio: (data: ArrayBuffer) => void;
  error: (error: string) => void;
  volume: (volume: number) => void;
}

export class BackendGeminiClient extends EventEmitter<BackendClientEventTypes> {
  private eventSource: EventSource | null = null;
  private _connected = false;
  private _volume = 0;

  get connected() {
    return this._connected;
  }

  get volume() {
    return this._volume;
  }

  async connect(): Promise<void> {
    if (this._connected) {
      return;
    }

    try {
      // Connect to the backend SSE stream
      this.eventSource = new EventSource("/api/ai?stream=gemini-live");

      this.eventSource.onopen = () => {
        console.warn("Connected to backend Gemini Live stream");
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleBackendMessage(data);
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);
        this.emit("error", "Connection error");
        this._connected = false;
        this.emit("disconnected");
      };
    } catch (error) {
      console.error("Failed to connect to backend:", error);
      this.emit("error", "Failed to connect to backend");
    }
  }

  async disconnect(): Promise<void> {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this._connected = false;
    this.emit("disconnected");
  }

  private handleBackendMessage(data: BackendMessage) {
    switch (data.type) {
      case "connected":
        this._connected = true;
        this.emit("connected");
        break;

      case "disconnected":
        this._connected = false;
        this.emit("disconnected");
        break;

      case "gemini-message":
        if (data.data) {
          this.processGeminiMessage(data.data);
        }
        break;

      case "error":
        this.emit("error", data.error || "Unknown error");
        break;
    }
  }

  private processGeminiMessage(message: GeminiMessageData) {
    if (message.serverContent) {
      const { serverContent } = message;

      if ("interrupted" in serverContent) {
        // Handle interruption
        return;
      }

      if ("turnComplete" in serverContent) {
        // Handle turn completion
        return;
      }

      if ("modelTurn" in serverContent) {
        const parts = serverContent.modelTurn?.parts || [];

        // Handle audio parts
        const audioParts = parts.filter(
          (p: MessagePart): p is AudioPart =>
            (p.inlineData && p.inlineData.mimeType?.startsWith("audio/pcm")) ||
            false
        );
        const base64s = audioParts.map((p: AudioPart) => p.inlineData?.data);

        // Handle other parts (text)
        const otherParts = parts.filter(
          (p: MessagePart) =>
            !p.inlineData || !p.inlineData.mimeType?.startsWith("audio/pcm")
        );

        // Emit audio data
        base64s.forEach((b64: string) => {
          if (b64) {
            const data = this.base64ToArrayBuffer(b64);
            this.emit("audio", data);

            // Simulate volume for visualization
            this._volume = Math.random() * 0.5 + 0.2;
            this.emit("volume", this._volume);

            // Reset volume after a short delay
            setTimeout(() => {
              this._volume = 0;
              this.emit("volume", this._volume);
            }, 100);
          }
        });

        if (otherParts.length > 0) {
          const content = { modelTurn: { parts: otherParts } };
          this.emit("content", content);
        }
      }
    }
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async sendRealtimeInput(chunks: Array<{ mimeType: string; data: string }>) {
    if (!this._connected) {
      console.warn("Cannot send data: not connected to backend");
      return;
    }

    try {
      // Send audio/video data to backend
      for (const chunk of chunks) {
        await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "realtime-input",
            data: chunk,
          }),
        });
      }
    } catch (error) {
      console.error("Error sending realtime input:", error);
      this.emit("error", "Failed to send data");
    }
  }
}
