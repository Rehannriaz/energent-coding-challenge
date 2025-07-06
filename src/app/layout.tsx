import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AIProvider } from "@/components/providers/ai-provider"
import { MotionProvider } from "@/components/providers/motion-provider"
import { GeminiProvider } from "@/components/providers/gemini-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Energent AI - Advanced AI Solutions",
  description:
    "Transform your business with cutting-edge AI technology. Experience the future of artificial intelligence.",
  keywords: "AI, artificial intelligence, machine learning, automation, business solutions",
  authors: [{ name: "Energent AI Team" }],
  openGraph: {
    title: "Energent AI - Advanced AI Solutions",
    description: "Transform your business with cutting-edge AI technology.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-inter antialiased">
        <AIProvider>
          <GeminiProvider>
            <MotionProvider>
              <Navigation />
              {children}
              <Footer />
            </MotionProvider>
          </GeminiProvider>
        </AIProvider>
      </body>
    </html>
  )
}
