"use client";

import { AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  return <AnimatePresence>{children}</AnimatePresence>;
}

// Global animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};

export const slideInRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerChild = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Smooth transition defaults
export const smoothTransition = {
  type: "spring" as const,
  damping: 25,
  stiffness: 120,
};

export const quickTransition = {
  type: "tween" as const,
  duration: 0.3,
  ease: "easeOut" as const,
};

// Hover animations
export const hoverScale = {
  scale: 1.05,
  transition: { type: "spring" as const, stiffness: 300 },
};

export const hoverLift = {
  y: -5,
  transition: { type: "spring" as const, stiffness: 300 },
};

// Responsive motion settings
export const getResponsiveMotionProps = () => {
  if (typeof window !== "undefined") {
    const isMobile = window.innerWidth < 768;
    const isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isReducedMotion) {
      return {
        initial: {},
        animate: {},
        transition: { duration: 0 },
      };
    }

    if (isMobile) {
      return {
        transition: {
          type: "tween" as const,
          duration: 0.2,
          ease: "easeOut" as const,
        },
      };
    }
  }

  return smoothTransition;
};
