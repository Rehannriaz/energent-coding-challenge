"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, Play, Pause } from "lucide-react";
import { useGeminiLiveContext } from "../contexts/gemini-live-context";
import { useWebcam } from "../hooks/use-webcam";
import { AudioRecorder } from "../lib/gemini/audio-recorder";
import classNames from "classnames";

export function GeminiVoiceAI() {
  // Move all hooks to the top level
  const { client, connected, connect, disconnect, volume } = useGeminiLiveContext();
  const webcam = useWebcam();
  const [muted, setMuted] = useState(false);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [inVolume, setInVolume] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const renderCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Check if we can use Gemini features
  const canUseGemini = Boolean(client);

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
        timeoutId = window.setTimeout(sendVideoFrame, 2000); // Send frames every 2 seconds
      }
    }

    if (connected && webcam.stream) {
      requestAnimationFrame(sendVideoFrame);
    }

    return () => {
      if (timeoutId) {clearTimeout(timeoutId);}
    };
  }, [connected, webcam.stream, client]);

  const handleConnect = async () => {
    if (connected) {
      await disconnect();
    } else {
      await connect();
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

  if (!canUseGemini) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Gemini Voice AI Assistant
          </h3>
          <p className="text-gray-300 mb-4">
            Loading Gemini API connection...
          </p>
          <div className="bg-yellow-500/20 text-yellow-300 p-4 rounded-lg">
            Make sure GEMINI_API_KEY is set in your backend environment
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          Gemini Voice AI Assistant
        </h3>
        <p className="text-gray-300">
          Interact with AI using voice and video
        </p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        {/* Video Display */}
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={classNames(
              "w-64 h-48 rounded-lg border-2 border-purple-500/30 bg-gray-900",
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
            <div className="w-64 h-48 rounded-lg border-2 border-purple-500/30 bg-gray-900 flex items-center justify-center">
              <VideoOff className="w-12 h-12 text-gray-500" />
            </div>
          )}
        </div>

        {/* Audio Visualization */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Input:</span>
            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500"
                style={{ width: `${Math.min(inVolume * 100, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Output:</span>
            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500"
                style={{ width: `${Math.min(volume * 100, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleMicToggle}
            className={classNames(
              "p-3 rounded-full transition-all duration-300",
              muted
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
            )}
            disabled={!connected}
          >
            {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <button
            onClick={handleVideoToggle}
            className={classNames(
              "p-3 rounded-full transition-all duration-300",
              webcam.isStreaming
                ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
            )}
            disabled={!connected}
          >
            {webcam.isStreaming ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={handleConnect}
            className={classNames(
              "px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2",
              connected
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-purple-500 hover:bg-purple-600 text-white"
            )}
          >
            {connected ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Disconnect</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Connect</span>
              </>
            )}
          </button>
        </div>

        {/* Status */}
        <div className="text-center">
          <div
            className={classNames(
              "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium",
              connected
                ? "bg-green-500/20 text-green-400"
                : "bg-gray-500/20 text-gray-400"
            )}
          >
            <div
              className={classNames(
                "w-2 h-2 rounded-full mr-2",
                connected ? "bg-green-400" : "bg-gray-400"
              )}
            />
            {connected ? "Connected" : "Disconnected"}
          </div>
        </div>
      </div>
    </div>
  );
}