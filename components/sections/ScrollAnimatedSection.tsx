"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const animationMap = {
  fadeIn: { opacity: 0 },
  slideUp: { opacity: 0, y: 50 },
  slideLeft: { opacity: 0, x: 50 },
  slideRight: { opacity: 0, x: -50 },
  scaleIn: { opacity: 0, scale: 0.85 },
};

export const ScrollAnimatedSection = ({
  children,
  className = "",
  animation = "slideUp",
  duration = 0.8,
  stagger = 0,
  threshold = 80,
}: {
  children: React.ReactNode;
  className?: string;
  animation?: keyof typeof animationMap;
  duration?: number;
  stagger?: number;
  threshold?: number;
}) => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const from = animationMap[animation];
      const target = stagger > 0 ? ".animated-child" : ref.current;

      gsap.from(target, {
        ...from,
        duration,
        stagger: stagger || undefined,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: ref.current,
          start: `top ${threshold}%`,
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
};
