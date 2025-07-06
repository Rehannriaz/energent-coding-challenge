"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, MessageSquare, Settings, Zap, Video, VideoOff } from "lucide-react";
import { useAI } from "@/components/providers/ai-provider";
import {
  hoverScale,
  smoothTransition,
} from "@/components/providers/motion-provider";
import { useGeminiLiveContext } from "@/contexts/gemini-live-context";
import { useWebcam } from "@/hooks/use-webcam";
import { AudioRecorder } from "@/lib/gemini/audio-recorder";
import classNames from "classnames";

export function AIIntegrationHub() {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"gemini" | "openai">(
    "gemini"
  );
  const { startConversation, stopConversation, isConnected, messages } =
    useAI();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Gemini Voice AI Integration
  const { client, connected, connect, disconnect, volume } = useGeminiLiveContext();
  const webcam = useWebcam();
  const [muted, setMuted] = useState(false);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [inVolume, setInVolume] = useState(0);
  const [geminiMessages, setGeminiMessages] = useState<Array<{role: "user" | "assistant", content: string}>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const renderCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Check if Gemini is available
  const geminiAvailable = Boolean(client);

  // Set up video stream
  useEffect(() => {
    if (videoRef.current && webcam.stream) {
      videoRef.current.srcObject = webcam.stream;
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
      }
    };

    if (connected && !muted && audioRecorder) {
      audioRecorder.on("data", onData).on("volume", setInVolume).start();
    } else {
      audioRecorder.stop();
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
      }

      if (connected && webcam.stream) {
        timeoutId = window.setTimeout(sendVideoFrame, 2000);
      }
    }

    if (connected && webcam.stream) {
      requestAnimationFrame(sendVideoFrame);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [connected, webcam.stream, client]);

  // Handle AI content responses
  useEffect(() => {
    const onContent = (data: any) => {
      if (data.modelTurn && data.modelTurn.parts) {
        const textParts = data.modelTurn.parts.filter((part: any) => part.text);
        if (textParts.length > 0) {
          const responseText = textParts.map((part: any) => part.text).join(' ');
          setGeminiMessages(prev => [...prev, { role: "assistant", content: responseText }]);
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
        await disconnect();
        setIsRecording(false);
      } else {
        setGeminiMessages([]); // Clear messages when starting new session
        await connect();
        setIsRecording(true);
      }
    } else {
      if (isRecording) {
        stopConversation();
        setIsRecording(false);
      } else {
        startConversation(selectedProvider);
        setIsRecording(true);
      }
    }
  };

  const handleMicToggle = () => {
    setMuted(!muted);
  };

  const handleVideoToggle = async () => {
    if (webcam.isStreaming) {
      webcam.stop();
    } else {
      await webcam.start();
    }
  };

  const isGeminiConnected = selectedProvider === "gemini" ? connected : isConnected;
  const isCurrentlyRecording = selectedProvider === "gemini" ? connected && !muted : isRecording;

  // Clear messages when switching providers
  useEffect(() => {
    if (selectedProvider === "gemini") {
      setGeminiMessages([]);
    }
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
            Experience real-time AI conversations with voice interaction. Switch
            between Google Gemini and OpenAI seamlessly.
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
                      className="text-xs"
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
                      className="text-xs"
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
                          "hidden": !webcam.stream,
                        }
                      )}
                    />
                    <canvas
                      ref={renderCanvasRef}
                      className="hidden"
                    />
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
                    isInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 10 }
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

              {/* Chat Messages */}
              <motion.div
                className="h-64 bg-black/20 rounded-lg p-4 mb-6 overflow-y-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.95 }
                }
                transition={{ ...smoothTransition, delay: 1.0 }}
              >
{(selectedProvider === "gemini" ? geminiMessages : messages).length === 0 ? (
                  <motion.div
                    className="flex items-center justify-center h-full text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <MessageSquare className="w-8 h-8 mr-2" />
                    </motion.div>
                    {selectedProvider === "gemini" 
                      ? "Connect to start voice and video conversation" 
                      : "Start a conversation to see messages here"}
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {(selectedProvider === "gemini" ? geminiMessages : messages).map((message, index) => (
                      <motion.div
                        key={`ai-message-${index}`}
                        className={`p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-blue-600/20 ml-8"
                            : "bg-gray-600/20 mr-8"
                        }`}
                        initial={{
                          opacity: 0,
                          x: message.role === "user" ? 20 : -20,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="text-sm text-gray-300 mb-1">
                          {message.role === "user" ? "You" : "AI Assistant"}
                        </div>
                        <div>{message.content}</div>
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
                        {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
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
                    isCurrentlyRecording ? { duration: 1, repeat: Infinity } : {}
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
                      animate={isCurrentlyRecording ? { rotate: [0, 10, -10, 0] } : {}}
                      transition={
                        isCurrentlyRecording ? { duration: 0.5, repeat: Infinity } : {}
                      }
                    >
                      {selectedProvider === "gemini" ? (
                        connected ? (
                          <MicOff className="w-6 h-6" />
                        ) : (
                          <Mic className="w-6 h-6" />
                        )
                      ) : (
                        isRecording ? (
                          <MicOff className="w-6 h-6" />
                        ) : (
                          <Mic className="w-6 h-6" />
                        )
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
                      isGeminiConnected ? { color: "#10b981" } : { color: "#9ca3af" }
                    }
                  >
                    {isGeminiConnected ? "Connected" : "Disconnected"}
                  </motion.div>
                  <motion.div
                    className="text-xs text-gray-500"
                    animate={
                      isCurrentlyRecording ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }
                    }
                    transition={
                      isCurrentlyRecording ? { duration: 1, repeat: Infinity } : {}
                    }
                  >
                    {selectedProvider === "gemini"
                      ? (connected ? "Voice & Video Active" : "Click to connect")
                      : (isRecording ? "Recording..." : "Click to start")}
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
                  "Experience lightning-fast AI responses with real-time voice processing and natural language understanding.",
                color: "blue",
                bgColor: "bg-blue-600/20",
              },
              {
                icon: Settings,
                title: "Multi-Provider Support",
                description:
                  "Switch seamlessly between Google Gemini and OpenAI models to find the perfect AI assistant for your needs.",
                color: "green",
                bgColor: "bg-green-600/20",
              },
              {
                icon: MessageSquare,
                title: "Natural Conversations",
                description:
                  "Engage in natural, flowing conversations with advanced context awareness and memory capabilities.",
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
                  className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center`}
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
