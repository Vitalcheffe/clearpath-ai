import type { Easing } from "framer-motion";

// Fix: framer-motion v12+ does not accept raw number[] as ease values.
// This module augmentation allows [number, number, number, number] arrays
// (cubic-bezier curves) to be used directly in variant objects without
// explicit tuple type annotations in every file.
declare module "framer-motion" {
  interface ValueAnimationTransition<V> {
    ease?: Easing | number[];
  }
}
