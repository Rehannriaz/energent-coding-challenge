"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { motion, useInView } from "framer-motion"

export function Statistics() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  
  const [counts, setCounts] = useState({
    users: 0,
    requests: 0,
    uptime: 0,
    countries: 0,
  })

  const finalCounts = {
    users: 2500000,
    requests: 50000000,
    uptime: 99.9,
    countries: 150,
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 120
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

  useEffect(() => {
    if (!isInView) return
    
    const duration = 2500 // 2.5 seconds
    const steps = 60
    const stepDuration = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      setCounts({
        users: Math.floor(finalCounts.users * easeOutQuart),
        requests: Math.floor(finalCounts.requests * easeOutQuart),
        uptime: Math.min(finalCounts.uptime, finalCounts.uptime * easeOutQuart),
        countries: Math.floor(finalCounts.countries * easeOutQuart),
      })

      if (step >= steps) {
        clearInterval(timer)
        setCounts(finalCounts)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [isInView])

  const stats = [
    {
      number: counts.users.toLocaleString() + "+",
      label: "Active Users",
      description: "Developers and businesses trust our platform",
    },
    {
      number: counts.requests.toLocaleString() + "+",
      label: "API Requests",
      description: "Processed monthly across all services",
    },
    {
      number: counts.uptime.toFixed(1) + "%",
      label: "Uptime",
      description: "Guaranteed service availability",
    },
    {
      number: counts.countries + "+",
      label: "Countries",
      description: "Global presence and support",
    },
  ]

  return (
    <section className="py-24 bg-[#0a0a0a]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Our Statistics</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Numbers that speak to our commitment to excellence and the trust our users place in us.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={`statistic-${index}`}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm text-center hover:bg-white/10 transition-all duration-300 h-full">
                <motion.div 
                  className="text-4xl md:text-5xl font-bold text-gradient mb-4"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                  transition={{ 
                    delay: index * 0.2 + 0.5,
                    type: "spring" as const,
                    damping: 15,
                    stiffness: 100
                  }}
                >
                  {stat.number}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{stat.label}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{stat.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
