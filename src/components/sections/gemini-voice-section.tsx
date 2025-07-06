"use client";

import { motion } from "framer-motion";
import { GeminiVoiceAI } from "../gemini-voice-ai";

export function GeminiVoiceSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a2e]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Experience AI Voice Interaction
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Interact with Google&apos;s Gemini AI using voice and video in
            real-time. Experience the future of AI-human interaction.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="w-full max-w-2xl">
            <GeminiVoiceAI />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎤</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Voice Input
            </h3>
            <p className="text-gray-400">
              Speak naturally and let AI understand your voice commands
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📹</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Video Understanding
            </h3>
            <p className="text-gray-400">
              AI can see and understand what&apos;s in your camera feed
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔊</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Audio Response
            </h3>
            <p className="text-gray-400">
              Get natural-sounding voice responses from AI
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
