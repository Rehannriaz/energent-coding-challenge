"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function Subscriptions() {
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

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      features: [
        "10,000 API calls/month",
        "Basic AI models",
        "Email support",
        "Standard documentation",
        "Community access",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      features: [
        "100,000 API calls/month",
        "Advanced AI models",
        "Priority support",
        "Custom integrations",
        "Analytics dashboard",
        "Team collaboration",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      features: [
        "Unlimited API calls",
        "All AI models",
        "24/7 dedicated support",
        "Custom model training",
        "On-premise deployment",
        "SLA guarantees",
        "Advanced security",
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#0a0a0a]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Subscription Plans</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={`plan-${plan.name}-${index}`}
              variants={itemVariants}
              whileHover={{
                scale: plan.popular ? 1.08 : 1.05,
                y: -10,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className={`p-8 relative flex flex-col ${
                  plan.popular
                    ? "bg-gradient-to-b from-blue-600/20 to-blue-800/20 border-blue-500/50"
                    : "bg-white/5 border-white/10"
                } backdrop-blur-sm transition-all duration-300 h-full`}
              >
                {plan.popular && (
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
                    }
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Star className="w-4 h-4 mr-1" />
                      </motion.div>
                      Most Popular
                    </div>
                  </motion.div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <motion.span
                      className="text-4xl font-bold"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={
                        isInView
                          ? { scale: 1, opacity: 1 }
                          : { scale: 0.5, opacity: 0 }
                      }
                      transition={{
                        delay: index * 0.2 + 0.5,
                        type: "spring" as const,
                        damping: 15,
                        stiffness: 100,
                      }}
                    >
                      {plan.price}
                    </motion.span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={`${plan.name}-feature-${featureIndex}`}
                      className="flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                      }
                      transition={{
                        delay: index * 0.1 + featureIndex * 0.1 + 0.7,
                        duration: 0.3,
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={
                          isInView
                            ? { scale: 1, rotate: 0 }
                            : { scale: 0, rotate: -180 }
                        }
                        transition={{
                          delay: index * 0.1 + featureIndex * 0.1 + 0.8,
                          type: "spring" as const,
                          damping: 10,
                          stiffness: 100,
                        }}
                      >
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      </motion.div>
                      <span className="text-gray-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  className="mt-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-white text-black hover:bg-gray-200"
                    } transition-colors duration-200`}
                    size="lg"
                  >
                    {plan.name === "Enterprise"
                      ? "Contact Sales"
                      : "Get Started"}
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
