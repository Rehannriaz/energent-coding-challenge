"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Mic,
  MicOff,
  MessageSquare,
  Settings,
  Zap,
  Video,
  VideoOff,
} from "lucide-react";
import { useAI } from "@/components/providers/ai-provider";
import {
  hoverScale,
  smoothTransition,
} from "@/components/providers/motion-provider";
import { useGeminiLiveContext } from "@/contexts/gemini-live-context";
import { useWebcam } from "@/hooks/use-webcam";
import { AudioRecorder } from "@/lib/gemini/audio-recorder";
import { useOpenAIVoiceChat } from "@/hooks/useOpenAIVoiceChat";
import classNames from "classnames";
import { LiveServerContent, Part } from "@google/genai";

// eslint-disable-next-line max-lines-per-function, complexity
export function AIIntegrationHub() {
  const [selectedProvider, setSelectedProvider] = useState<"gemini" | "openai">(
    "gemini"
  );
  const { startConversation, stopConversation, isConnected } = useAI();
  // Note: These may be used for other AI providers in the future
  void startConversation;
  void stopConversation;
  void isConnected;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Gemini Voice AI Integration
  const { client, connected, connect, disconnect, volume } =
    useGeminiLiveContext();
  const webcam = useWebcam();
  const [muted, setMuted] = useState(false);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [inVolume, setInVolume] = useState(0);
  const [, setGeminiMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [textLogs, setTextLogs] = useState<
    Array<{ timestamp: Date; type: string; message: string }>
  >([]);
  const lastAudioLogTime = useRef<number>(0);
  const lastVideoLogTime = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const renderCanvasRef = useRef<HTMLCanvasElement>(null);
  const textLogsRef = useRef<HTMLDivElement>(null);

  // Check if Gemini is available
  const geminiAvailable = Boolean(client);

  // OpenAI Voice Chat Integration (simplified to match Gemini)
  const { 
    state: openAIState, 
    connect: connectOpenAI, 
    disconnect: disconnectOpenAI,
  } = useOpenAIVoiceChat(
    {
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
      instructions: 'You are a helpful voice assistant. Respond naturally and conversationally.',
      voice: 'alloy',
      voiceActivityDetection: {
        threshold: 0.9,
        silenceDurationMs: 500,
        prefixPaddingMs: 300,
      },
    },
    {
      onConnectionChange: (status) => {
        addTextLog("openai.connection", `OpenAI status: ${status}`);
      },
      onTranscriptUpdate: (transcript, isComplete) => {
        addTextLog("openai.transcript", `${isComplete ? 'Complete' : 'Partial'}: ${transcript.substring(0, 50)}${transcript.length > 50 ? '...' : ''}`);
      },
      onError: (error) => {
        addTextLog("openai.error", `Error: ${error}`);
      },
    }
  );

  // Helper function to add text logs
  const addTextLog = (type: string, message: string) => {
    setTextLogs((prev) => [...prev, { timestamp: new Date(), type, message }]);
  };

  // Auto-scroll function for text logs
  useEffect(() => {
    if (textLogsRef.current) {
      textLogsRef.current.scrollTop = textLogsRef.current.scrollHeight;
    }
  }, [textLogs]);

  // Set up video stream
  useEffect(() => {
    if (videoRef.current && webcam.stream) {
      videoRef.current.srcObject = webcam.stream;
      addTextLog("video.stream", "Video stream connected");
    }
  }, [webcam.stream]);

  // Audio recording setup
  useEffect(() => {
    const onData = (base64: string) => {
      if (client && connected) {
        client.sendRealtimeInput([
          {
            mimeType: "audio/pcm;rate=16000",
            data: base64,
          },
        ]);

        // Throttle audio logging to once per second to avoid spam
        const now = Date.now();
        if (now - lastAudioLogTime.current > 1000) {
          addTextLog("audio.send", "Audio data streaming to AI");
          lastAudioLogTime.current = now;
        }
      }
    };

    if (connected && !muted && audioRecorder) {
      audioRecorder.on("data", onData).on("volume", setInVolume).start();
      addTextLog("audio.start", "Audio recording started");
    } else {
      audioRecorder.stop();
      if (connected && muted) {
        addTextLog("audio.muted", "Audio recording muted");
      } else if (!connected) {
        addTextLog("audio.stop", "Audio recording stopped");
      }
    }

    return () => {
      audioRecorder.off("data", onData).off("volume", setInVolume);
    };
  }, [connected, client, muted, audioRecorder]);

  // Video frame sending
  useEffect(() => {
    let timeoutId: number;

    function sendVideoFrame() {
      const video = videoRef.current;
      const canvas = renderCanvasRef.current;

      if (!video || !canvas || !webcam.stream || !client) {
        return;
      }

      const ctx = canvas.getContext("2d")!;
      canvas.width = video.videoWidth * 0.25;
      canvas.height = video.videoHeight * 0.25;

      if (canvas.width + canvas.height > 0) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL("image/jpeg", 1.0);
        const data = base64.slice(base64.indexOf(",") + 1);
        client.sendRealtimeInput([{ mimeType: "image/jpeg", data }]);

        // Throttle video logging to avoid spam (every 5 seconds)
        const now = Date.now();
        if (now - lastVideoLogTime.current > 5000) {
          addTextLog("video.send", "Video frames streaming to AI");
          lastVideoLogTime.current = now;
        }
      }

      if (connected && webcam.stream) {
        timeoutId = window.setTimeout(sendVideoFrame, 2000);
      }
    }

    if (connected && webcam.stream) {
      requestAnimationFrame(sendVideoFrame);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [connected, webcam.stream, client]);

  // Handle AI content responses
  useEffect(() => {
    const onContent = (data: LiveServerContent) => {
      if (data.modelTurn && data.modelTurn.parts) {
        const textParts = data.modelTurn.parts.filter(
          (part: Part) => part.text
        );
        if (textParts.length > 0) {
          const responseText = textParts
            .map((part: Part) => part.text)
            .join(" ");
          setGeminiMessages((prev) => [
            ...prev,
            { role: "assistant", content: responseText },
          ]);
          addTextLog(
            "ai.response",
            `AI responded: ${responseText.substring(0, 50)}${
              responseText.length > 50 ? "..." : ""
            }`
          );
        }
      }
    };

    if (client && connected) {
      client.on("content", onContent);
    }

    return () => {
      if (client) {
        client.off("content", onContent);
      }
    };
  }, [client, connected]);

  const handleToggleRecording = async () => {
    if (selectedProvider === "gemini") {
      if (connected) {
        addTextLog("system.disconnect", "Disconnecting from Gemini AI");
        await disconnect();
      } else {
        setGeminiMessages([]); // Clear messages when starting new session
        setTextLogs([]); // Clear logs when starting new session
        addTextLog("system.connect", "Connecting to Gemini AI");
        await connect();
      }
    } else {
      // OpenAI Voice Chat
      if (openAIState.status === 'CONNECTED') {
        addTextLog("system.disconnect", "Disconnecting from OpenAI");
        disconnectOpenAI();
      } else {
        setTextLogs([]); // Clear logs when starting new session
        addTextLog("system.connect", "Connecting to OpenAI Voice Chat");
        await connectOpenAI();
      }
    }
  };

  const handleMicToggle = () => {
    setMuted(!muted);
  };

  const handleVideoToggle = async () => {
    if (webcam.isStreaming) {
      addTextLog("video.stop", "Stopping video stream");
      webcam.stop();
    } else {
      addTextLog("video.start", "Starting video stream");
      await webcam.start();
    }
  };

  const isGeminiConnected =
    selectedProvider === "gemini" ? connected : openAIState.status === 'CONNECTED';
  const isCurrentlyRecording =
    selectedProvider === "gemini" ? connected && !muted : openAIState.status === 'CONNECTED';

  // Clear messages when switching providers
  useEffect(() => {
    if (selectedProvider === "gemini") {
      setGeminiMessages([]);
    }
    setTextLogs([]);
    addTextLog(
      "system.provider",
      `Switched to ${selectedProvider.toUpperCase()}`
    );
  }, [selectedProvider]);

  return (
    <section
      id="ai-hub"
      className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#161616]"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={smoothTransition}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ ...smoothTransition, delay: 0.2 }}
          >
            <span className="text-gradient">AI Integration Hub</span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ ...smoothTransition, delay: 0.4 }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* AI Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ ...smoothTransition, delay: 0.6 }}
          >
            <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
              <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }
                }
                transition={{ ...smoothTransition, delay: 0.8 }}
              >
                <h3 className="text-2xl font-semibold">Voice AI Assistant</h3>
                <div className="flex gap-2">
                  <motion.div
                    whileHover={hoverScale}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      variant={
                        selectedProvider === "gemini" ? "default" : "outline"
                      }
                      onClick={() => setSelectedProvider("gemini")}
                      className={`text-xs ${
                        selectedProvider === "gemini"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Gemini
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={hoverScale}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      variant={
                        selectedProvider === "openai" ? "default" : "outline"
                      }
                      onClick={() => setSelectedProvider("openai")}
                      className={`text-xs ${
                        selectedProvider === "openai"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      OpenAI
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Video Display for Gemini */}
              {selectedProvider === "gemini" && geminiAvailable && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.9 }
                  }
                  transition={{ ...smoothTransition, delay: 0.9 }}
                >
                  <div className="relative mx-auto w-48 h-36">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={classNames(
                        "w-full h-full rounded-lg border-2 border-purple-500/30 bg-gray-900 object-cover",
                        {
                          hidden: !webcam.stream,
                        }
                      )}
                    />
                    <canvas ref={renderCanvasRef} className="hidden" />
                    {!webcam.stream && (
                      <div className="w-full h-full rounded-lg border-2 border-purple-500/30 bg-gray-900 flex items-center justify-center">
                        <VideoOff className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Audio Visualization for Gemini */}
              {selectedProvider === "gemini" && geminiAvailable && (
                <motion.div
                  className="flex items-center justify-center space-x-4 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                  }
                  transition={{ ...smoothTransition, delay: 1.0 }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300">Input:</span>
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-green-500"
                        style={{ width: `${Math.min(inVolume * 100, 100)}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300">Output:</span>
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500"
                        style={{ width: `${Math.min(volume * 100, 100)}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Audio Visualization for OpenAI - simplified to match Gemini */}
              {selectedProvider === "openai" && (
                <motion.div
                  className="flex items-center justify-center space-x-4 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                  }
                  transition={{ ...smoothTransition, delay: 1.0 }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300">Input:</span>
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-green-500"
                        style={{ width: `${openAIState.isUserSpeaking ? 75 : 0}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300">Output:</span>
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500"
                        style={{ width: `${openAIState.isAssistantSpeaking ? 75 : 0}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Text Activity Log */}
              <motion.div
                className="h-32 bg-black/30 rounded-lg p-3 mb-6 overflow-y-auto border border-gray-700/50"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.95 }
                }
                transition={{ ...smoothTransition, delay: 1.1 }}
                ref={textLogsRef}
              >
                <div className="text-xs text-gray-500 mb-2 font-mono">
                  Activity Log:
                </div>
                {textLogs.length === 0 ? (
                  <div className="flex items-center justify-center h-20 text-gray-600 text-sm">
                    Activity will appear here when you connect...
                  </div>
                ) : (
                  <div className="space-y-1">
                    {textLogs.map((log, index) => (
                      <motion.div
                        key={`log-${log.timestamp.getTime()}-${index}`}
                        className="flex items-start gap-2 text-xs font-mono"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <span className="text-gray-500 shrink-0">
                          {log.timestamp.toLocaleTimeString().slice(0, -3)}
                        </span>
                        <span
                          className={`shrink-0 ${
                            log.type.includes("system")
                              ? "text-blue-400"
                              : log.type.includes("audio")
                              ? "text-green-400"
                              : log.type.includes("video")
                              ? "text-purple-400"
                              : log.type.includes("ai") || log.type.includes("openai")
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                        >
                          {log.type}
                        </span>
                        <span className="text-gray-300 break-words">
                          {log.message}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Controls */}
              <motion.div
                className="flex items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ ...smoothTransition, delay: 1.4 }}
              >
                {/* Gemini Voice Controls */}
                {selectedProvider === "gemini" && (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        size="lg"
                        onClick={handleMicToggle}
                        className={classNames(
                          "rounded-full w-12 h-12",
                          muted
                            ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        )}
                        disabled={!connected}
                      >
                        {muted ? (
                          <MicOff className="w-5 h-5" />
                        ) : (
                          <Mic className="w-5 h-5" />
                        )}
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        size="lg"
                        onClick={handleVideoToggle}
                        className={classNames(
                          "rounded-full w-12 h-12",
                          webcam.isStreaming
                            ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                            : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                        )}
                        disabled={!connected}
                      >
                        {webcam.isStreaming ? (
                          <Video className="w-5 h-5" />
                        ) : (
                          <VideoOff className="w-5 h-5" />
                        )}
                      </Button>
                    </motion.div>
                  </>
                )}

                {/* Main Connect/Record Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={isCurrentlyRecording ? { scale: [1, 1.1, 1] } : {}}
                  transition={
                    isCurrentlyRecording
                      ? { duration: 1, repeat: Infinity }
                      : {}
                  }
                >
                  <Button
                    size="lg"
                    onClick={handleToggleRecording}
                    className={`rounded-full w-16 h-16 ${
                      isCurrentlyRecording
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    <motion.div
                      animate={
                        isCurrentlyRecording ? { rotate: [0, 10, -10, 0] } : {}
                      }
                      transition={
                        isCurrentlyRecording
                          ? { duration: 0.5, repeat: Infinity }
                          : {}
                      }
                    >
                      {selectedProvider === "gemini" ? (
                        connected ? (
                          <MicOff className="w-6 h-6" />
                        ) : (
                          <Mic className="w-6 h-6" />
                        )
                      ) : openAIState.status === 'CONNECTED' ? (
                        <MicOff className="w-6 h-6" />
                      ) : (
                        <Mic className="w-6 h-6" />
                      )}
                    </motion.div>
                  </Button>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1.6 }}
                >
                  <motion.div
                    className="text-sm text-gray-400"
                    animate={
                      isGeminiConnected
                        ? { color: "#10b981" }
                        : { color: "#9ca3af" }
                    }
                  >
                    {isGeminiConnected ? "Connected" : "Disconnected"}
                  </motion.div>
                  <motion.div
                    className="text-xs text-gray-500"
                    animate={
                      isCurrentlyRecording
                        ? { opacity: [0.5, 1, 0.5] }
                        : { opacity: 1 }
                    }
                    transition={
                      isCurrentlyRecording
                        ? { duration: 1, repeat: Infinity }
                        : {}
                    }
                  >
                    {(() => {
                      if (selectedProvider === "gemini") {
                        return connected ? "Voice & Video Active" : "Click to connect";
                      }
                      if (openAIState.status === 'CONNECTED') {
                        return "Voice Chat Active";
                      }
                      if (openAIState.status === 'CONNECTING') {
                        return "Connecting...";
                      }
                      return "Click to start";
                    })()}
                  </motion.div>
                </motion.div>
              </motion.div>
            </Card>
          </motion.div>

          {/* Features */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ ...smoothTransition, delay: 0.8 }}
          >
            {[
              {
                icon: Zap,
                title: "Real-time Processing",
                description:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                color: "blue",
                bgColor: "bg-blue-600/20",
              },
              {
                icon: Settings,
                title: "Multi-Provider Support",
                description:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                color: "green",
                bgColor: "bg-green-600/20",
              },
              {
                icon: MessageSquare,
                title: "Natural Conversations",
                description:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                color: "purple",
                bgColor: "bg-purple-600/20",
              },
            ].map((feature, index) => (
              <motion.div
                key={`ai-feature-${index}`}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                }
                transition={{ ...smoothTransition, delay: 1.0 + index * 0.2 }}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
              >
                <motion.div
                  className={`w-12 h-12 px-2 ${feature.bgColor} rounded-lg flex items-center justify-center`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5,
                    }}
                  >
                    <feature.icon
                      className={`w-6 h-6 text-${feature.color}-400`}
                    />
                  </motion.div>
                </motion.div>
                <div>
                  <motion.h4
                    className="text-xl font-semibold mb-2"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1.2 + index * 0.2 }}
                  >
                    {feature.title}
                  </motion.h4>
                  <motion.p
                    className="text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1.4 + index * 0.2 }}
                  >
                    {feature.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
