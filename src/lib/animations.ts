import type { Variants } from "framer-motion";

// Type-safe cubic-bezier ease values for framer-motion variants
// framer-motion v12+ requires ease arrays to be typed as [number, number, number, number]
// Using `as const` or explicit tuple types in variant objects resolves the TS error.

// Pre-built variant presets used across the app
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};
