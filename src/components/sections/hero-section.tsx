"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  fadeInUp,
  staggerContainer,
  staggerChild,
  smoothTransition,
  hoverScale,
} from "@/components/providers/motion-provider";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToAIHub = () => {
    const aiHubElement = document.getElementById("ai-hub");
    if (aiHubElement) {
      aiHubElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const particleVariants = {
    animate: {
      y: [0, -100, 0],
      opacity: [0, 1, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#161616] to-[#0a0a0a]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`,
          }}
          animate={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`,
          }}
          transition={{ type: "spring" as const, stiffness: 50, damping: 25 }}
        />
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            variants={particleVariants}
            animate="animate"
            transition={{
              ...particleVariants.animate.transition,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center xl:mt-0 mt-16"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div
          variants={fadeInUp}
          transition={smoothTransition}
          className="mb-8 mt-14 xl:block hidden"
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10"
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
            </motion.div>
            <span className="text-sm text-gray-300">
              Introducing Next-Gen AI
            </span>
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          variants={fadeInUp}
          transition={{ ...smoothTransition, delay: 0.2 }}
        >
          <motion.span
            className="text-gradient block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Transform Your Business
          </motion.span>
          <motion.span
            className="text-white block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            with Advanced AI
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          variants={fadeInUp}
          transition={{ ...smoothTransition, delay: 0.4 }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={fadeInUp}
          transition={{ ...smoothTransition, delay: 0.6 }}
        >
          <motion.div whileHover={hoverScale} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200 transition-all duration-300 group"
              onClick={scrollToAIHub}
            >
              Get Started Free
              <motion.div
                className="ml-2 inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Button>
          </motion.div>
          <motion.div whileHover={hoverScale} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              onClick={scrollToAIHub}
            >
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            { number: "99.9%", label: "Uptime Guarantee" },
            { number: "10M+", label: "API Calls Daily" },
            { number: "150+", label: "Enterprise Clients" },
          ].map((stat, index) => (
            <motion.div
              key={`hero-stat-${index}`}
              className="text-center"
              variants={staggerChild}
              transition={{ ...smoothTransition, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div
                className="text-3xl md:text-4xl font-bold text-gradient mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.8 + index * 0.1,
                  duration: 0.5,
                  type: "spring",
                }}
              >
                {stat.number}
              </motion.div>
              <motion.div
                className="text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
