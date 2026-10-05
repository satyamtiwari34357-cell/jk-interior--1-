import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Animation Tokens (Quiet Luxury, Architectural timing)
export const MOTION_TOKENS = {
  duration: {
    fast: 0.25,
    standard: 0.5,
    editorial: 0.8,
    hero: 1.0,
    slow: 1.4
  },
  ease: {
    editorial: 'power3.out',
    smooth: 'power2.out',
    gentle: 'sine.inOut',
    sharp: 'power4.out'
  },
  colors: {
    terracotta: '#B7653F',
    charcoal: '#181816',
    gold: '#c5a880',
    cream: '#fbf9f5'
  }
};

/**
 * Checks if reduced motion is requested by user
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Custom React hook for GSAP animations with automatic context scoping and cleanup
 */
export function useGsapAnimation(
  animationCallback: (context: gsap.Context) => void,
  dependencies: any[] = []
) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || isReducedMotion()) return;

    // Create scoped GSAP context
    const ctx = gsap.context(() => {
      animationCallback(ctx);
    }, containerRef);

    return () => {
      ctx.revert(); // Automatically kills all animations and ScrollTriggers created within this context
    };
  }, dependencies);

  return containerRef;
}

export { gsap, ScrollTrigger };
