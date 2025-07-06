"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building,
  ShoppingCart,
  Heart,
  GraduationCap,
  Car,
  Home,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function Applications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100,
      },
    },
  };

  const applications = [
    {
      icon: Building,
      title: "Enterprise Solutions",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      features: [
        "Process Automation",
        "Predictive Analytics",
        "Risk Management",
      ],
      color: "from-blue-500/20 to-blue-600/20",
    },
    {
      icon: ShoppingCart,
      title: "E-commerce Intelligence",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      features: [
        "Product Recommendations",
        "Price Optimization",
        "Customer Insights",
      ],
      color: "from-green-500/20 to-green-600/20",
    },
    {
      icon: Heart,
      title: "Healthcare AI",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      features: ["Medical Imaging", "Drug Discovery", "Patient Monitoring"],
      color: "from-red-500/20 to-red-600/20",
    },
    {
      icon: GraduationCap,
      title: "Education Technology",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      features: [
        "Adaptive Learning",
        "Performance Analytics",
        "Content Generation",
      ],
      color: "from-purple-500/20 to-purple-600/20",
    },
    {
      icon: Car,
      title: "Automotive Intelligence",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      features: [
        "Autonomous Navigation",
        "Predictive Maintenance",
        "Traffic Optimization",
      ],
      color: "from-orange-500/20 to-orange-600/20",
    },
    {
      icon: Home,
      title: "Smart Home Solutions",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      features: ["Home Automation", "Energy Optimization", "Security Systems"],
      color: "from-teal-500/20 to-teal-600/20",
    },
  ];

  return (
    <section
      id="applications"
      className="py-24 bg-gradient-to-b from-[#161616] to-[#0a0a0a]"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Applications</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {applications.map((app, index) => (
            <motion.div
              key={`application-${index}`}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className={`p-8 bg-gradient-to-br ${app.color} border-white/10 backdrop-blur-sm transition-all duration-300 group h-full`}
              >
                <div className="flex items-center mb-6">
                  <motion.div
                    className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mr-4"
                    whileHover={{
                      scale: 1.2,
                      rotate: 10,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <app.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">{app.title}</h3>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  {app.description}
                </p>

                <div className="space-y-2 mb-6">
                  {app.features.map((feature, featureIndex) => (
                    <motion.div
                      key={`application-${index}-feature-${featureIndex}`}
                      className="flex items-center text-sm text-gray-400"
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                      }
                      transition={{
                        delay: index * 0.1 + featureIndex * 0.1 + 0.5,
                        duration: 0.3,
                      }}
                    >
                      <motion.div
                        className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3"
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : { scale: 0 }}
                        transition={{
                          delay: index * 0.1 + featureIndex * 0.1 + 0.7,
                          type: "spring" as const,
                          stiffness: 400,
                          damping: 10,
                        }}
                      />
                      {feature}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-between group-hover:bg-white/10 transition-colors"
                  >
                    Learn More
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{
                        type: "spring" as const,
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
