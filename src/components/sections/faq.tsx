"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How does the AI voice integration work?",
      answer:
        "Our AI voice integration uses advanced speech recognition and natural language processing to enable real-time conversations. You can switch between Google Gemini and OpenAI models seamlessly through our interface.",
    },
    {
      question: "What programming languages do you support?",
      answer:
        "We provide SDKs and APIs for all major programming languages including JavaScript, Python, Java, C#, Go, and more. Our REST API can be used with any language that supports HTTP requests.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes! We offer a 14-day free trial with full access to our Starter plan features. No credit card required to get started.",
    },
    {
      question: "How secure is my data?",
      answer:
        "We use enterprise-grade security with end-to-end encryption, SOC 2 compliance, and regular security audits. Your data is never stored permanently and is processed in secure, isolated environments.",
    },
    {
      question: "Can I integrate with my existing systems?",
      answer:
        "Our platform is designed for easy integration with existing systems through our comprehensive APIs, webhooks, and pre-built connectors for popular platforms.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "We offer multiple support channels including email, chat, and phone support. Enterprise customers get dedicated account managers and 24/7 priority support.",
    },
  ]

  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Frequently Asked Questions</span>
          </h2>
          <p className="text-xl text-gray-400">Get answers to the most common questions about our AI platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
              <button
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
