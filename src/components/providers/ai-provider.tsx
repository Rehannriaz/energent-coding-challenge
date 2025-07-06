"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIContextType {
  messages: Message[]
  isConnected: boolean
  isRecording: boolean
  startConversation: (provider: "gemini" | "openai") => void
  stopConversation: () => void
  sendMessage: (message: string) => void
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export function AIProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const startConversation = (provider: "gemini" | "openai") => {
    setIsConnected(true)
    setIsRecording(true)
    // Simulate AI connection
    setTimeout(() => {
      setMessages([
        {
          role: "assistant",
          content: `Hello! I'm your AI assistant powered by ${provider === "gemini" ? "Google Gemini" : "OpenAI"}. How can I help you today?`,
          timestamp: new Date(),
        },
      ])
    }, 1000)
  }

  const stopConversation = () => {
    setIsConnected(false)
    setIsRecording(false)
  }

  const sendMessage = (message: string) => {
    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant",
        content: `I understand you said: "${message}". This is a simulated response. In a real implementation, this would connect to the actual AI service.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1500)
  }

  return (
    <AIContext.Provider
      value={{
        messages,
        isConnected,
        isRecording,
        startConversation,
        stopConversation,
        sendMessage,
      }}
    >
      {children}
    </AIContext.Provider>
  )
}

export function useAI() {
  const context = useContext(AIContext)
  if (context === undefined) {
    throw new Error("useAI must be used within an AIProvider")
  }
  return context
}
