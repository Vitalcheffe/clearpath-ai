import "framer-motion";

declare module "framer-motion" {
  interface ValueAnimationTransition<V> {
    ease?: Easing | number[];
  }
}
