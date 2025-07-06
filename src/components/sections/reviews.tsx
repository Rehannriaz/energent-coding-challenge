"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export function Reviews() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  }
  
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
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

  const reviews = [
    {
      name: "Alex Thompson",
      role: "CTO at TechCorp",
      company: "TechCorp",
      rating: 5,
      review:
        "Energent AI has transformed our development process. The API is incredibly fast and the results are consistently impressive.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&crop=face",
    },
    {
      name: "Maria Garcia",
      role: "Product Manager",
      company: "InnovateLabs",
      rating: 5,
      review:
        "The voice AI integration is seamless. Our customers love the natural conversation experience it provides.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop&crop=face",
    },
    {
      name: "David Chen",
      role: "Founder",
      company: "StartupXYZ",
      rating: 5,
      review: "Outstanding support and documentation. We were up and running in minutes, not hours.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&h=60&fit=crop&crop=face",
    },
    {
      name: "Sarah Johnson",
      role: "Lead Developer",
      company: "MegaCorp",
      rating: 5,
      review:
        "The multi-provider support is a game-changer. Being able to switch between AI models gives us incredible flexibility.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
    },
    {
      name: "Michael Brown",
      role: "VP Engineering",
      company: "ScaleUp Inc",
      rating: 5,
      review: "Reliable, fast, and feature-rich. Exactly what we needed for our enterprise-grade applications.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face",
    },
    {
      name: "Lisa Wang",
      role: "AI Researcher",
      company: "Research Labs",
      rating: 5,
      review: "The quality of AI responses is exceptional. It has significantly improved our research productivity.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-[#161616] to-[#0a0a0a]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">What Our Users Say</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what industry leaders are saying about our platform.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {reviews.map((review, index) => (
            <motion.div
              key={`review-${index}`}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 h-full">
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <motion.div
                      key={`review-${index}-star-${i}`}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -180 }}
                      transition={{ 
                        delay: index * 0.1 + i * 0.1 + 0.5,
                        type: "spring" as const,
                        damping: 10,
                        stiffness: 100
                      }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>

                <motion.p 
                  className="text-gray-300 mb-6 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ 
                    delay: index * 0.1 + 0.7,
                    duration: 0.5
                  }}
                >
                  &ldquo;{review.review}&rdquo;
                </motion.p>

                <div className="flex items-center">
                  <motion.div
                    className="w-12 h-12 rounded-full mr-4 overflow-hidden"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                    transition={{ 
                      delay: index * 0.1 + 0.8,
                      type: "spring" as const,
                      damping: 15,
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ 
                      delay: index * 0.1 + 0.9,
                      duration: 0.4
                    }}
                  >
                    <h4 className="font-semibold">{review.name}</h4>
                    <p className="text-sm text-gray-400">{review.role}</p>
                    <p className="text-sm text-blue-400">{review.company}</p>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
