"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, useInView, AnimatePresence } from "framer-motion"

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }
  
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100
      }
    }
  }
  
  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100
      }
    }
  }

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
    <section className="py-24 bg-[#0a0a0a]" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Frequently Asked Questions</span>
          </h2>
          <p className="text-xl text-gray-400">Get answers to the most common questions about our AI platform.</p>
        </motion.div>

        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={`faq-${index}`}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
                <motion.button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </motion.div>
                </motion.button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ 
                        duration: 0.3,
                        ease: "easeInOut",
                        opacity: { duration: 0.2 }
                      }}
                      className="overflow-hidden"
                    >
                      <motion.div 
                        className="px-6 pb-6"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
