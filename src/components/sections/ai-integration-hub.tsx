"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, MessageSquare, Settings, Zap } from "lucide-react"
import { useAI } from "@/components/providers/ai-provider"

export function AIIntegrationHub() {
  const [isRecording, setIsRecording] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<"gemini" | "openai">("gemini")
  const { startConversation, stopConversation, isConnected, messages } = useAI()

  const handleToggleRecording = () => {
    if (isRecording) {
      stopConversation()
      setIsRecording(false)
    } else {
      startConversation(selectedProvider)
      setIsRecording(true)
    }
  }

  return (
    <section id="ai-hub" className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#161616]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">AI Integration Hub</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience real-time AI conversations with voice interaction. Switch between Google Gemini and OpenAI
            seamlessly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* AI Chat Interface */}
          <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">Voice AI Assistant</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={selectedProvider === "gemini" ? "default" : "outline"}
                  onClick={() => setSelectedProvider("gemini")}
                  className="text-xs"
                >
                  Gemini
                </Button>
                <Button
                  size="sm"
                  variant={selectedProvider === "openai" ? "default" : "outline"}
                  onClick={() => setSelectedProvider("openai")}
                  className="text-xs"
                >
                  OpenAI
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-64 bg-black/20 rounded-lg p-4 mb-6 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <MessageSquare className="w-8 h-8 mr-2" />
                  Start a conversation to see messages here
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        message.role === "user" ? "bg-blue-600/20 ml-8" : "bg-gray-600/20 mr-8"
                      }`}
                    >
                      <div className="text-sm text-gray-300 mb-1">
                        {message.role === "user" ? "You" : "AI Assistant"}
                      </div>
                      <div>{message.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={handleToggleRecording}
                className={`rounded-full w-16 h-16 ${
                  isRecording ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>
              <div className="text-center">
                <div className="text-sm text-gray-400">{isConnected ? "Connected" : "Disconnected"}</div>
                <div className="text-xs text-gray-500">{isRecording ? "Recording..." : "Click to start"}</div>
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Real-time Processing</h4>
                <p className="text-gray-400">
                  Experience lightning-fast AI responses with real-time voice processing and natural language
                  understanding.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Multi-Provider Support</h4>
                <p className="text-gray-400">
                  Switch seamlessly between Google Gemini and OpenAI models to find the perfect AI assistant for your
                  needs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Natural Conversations</h4>
                <p className="text-gray-400">
                  Engage in natural, flowing conversations with advanced context awareness and memory capabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
