"use client"

import { Card } from "@/components/ui/card"
import { Brain, Shield, Zap, Globe, Code, BarChart } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export function CoreFeatures() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }
  
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
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
    hidden: { opacity: 0, y: -20 },
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

  const features = [
    {
      icon: Brain,
      title: "Advanced Machine Learning",
      description: "Cutting-edge ML algorithms that adapt and learn from your data patterns.",
      color: "text-blue-400",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and security protocols to protect your sensitive data.",
      color: "text-green-400",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with sub-second response times for all operations.",
      color: "text-yellow-400",
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Distributed infrastructure ensuring reliable service worldwide.",
      color: "text-purple-400",
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "Comprehensive APIs and SDKs for seamless integration.",
      color: "text-orange-400",
    },
    {
      icon: BarChart,
      title: "Real-time Analytics",
      description: "Detailed insights and analytics to track performance and usage.",
      color: "text-pink-400",
    },
  ]

  return (
    <section id="features" className="py-24 bg-[#0a0a0a]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Core Features</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover the powerful capabilities that make our AI platform the choice of industry leaders.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={`core-feature-${index}`}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group h-full">
                <motion.div
                  className={`w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-6`}
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </motion.div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
