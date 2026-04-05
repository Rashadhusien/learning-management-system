// "use client";

// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";

// interface ScrollAnimatedSectionProps {
//   children: React.ReactNode;
//   className?: string;
//   animation?: "fadeIn" | "slideUp" | "scaleIn" | "slideLeft" | "slideRight";
//   delay?: number;
//   duration?: number;
//   stagger?: number;
//   threshold?: number;
// }

// export const ScrollAnimatedSection = ({
//   children,
//   className = "",
//   animation = "fadeIn",
//   delay = 0,
//   duration = 0.8,
//   stagger = 0,
//   threshold = 0.8,
// }: ScrollAnimatedSectionProps) => {
//   const sectionRef = useRef<HTMLElement>(null);
//   const { scrollReveal, staggerFadeIn } = useGSAPAnimation();

//   useEffect(() => {
//     if (!sectionRef.current) return;

//     const animationParams = {
//       fadeIn: { opacity: 0 },
//       slideUp: { opacity: 0, y: 50 },
//       slideDown: { opacity: 0, y: -50 },
//       slideLeft: { opacity: 0, x: 50 },
//       slideRight: { opacity: 0, x: -50 },
//       scaleIn: { opacity: 0, scale: 0.8 },
//     };

//     const params = animationParams[animation] || animationParams.fadeIn;

//     if (stagger > 0) {
//       // For staggered animations, target child elements
//       staggerFadeIn(
//         `${className} > *`,
//         stagger,
//         duration,
//         params as { opacity: number; y?: number; x?: number },
//       );
//     } else {
//       // For single element animations
//       scrollReveal(
//         sectionRef.current,
//         {
//           start: `top ${threshold * 100}%`,
//           end: "bottom 20%",
//         },
//         params as { opacity: number; y?: number; x?: number },
//       );
//     }
//   }, [
//     animation,
//     delay,
//     duration,
//     stagger,
//     threshold,
//     className,
//     scrollReveal,
//     staggerFadeIn,
//   ]);

//   return (
//     <section ref={sectionRef} className={className}>
//       {children}
//     </section>
//   );
// };

// interface AnimatedCardProps {
//   children: React.ReactNode;
//   className?: string;
//   hoverScale?: number;
//   hoverDuration?: number;
// }

// export const AnimatedCard = ({
//   children,
//   className = "",
//   hoverScale = 1.02,
//   hoverDuration = 0.3,
// }: AnimatedCardProps) => {
//   const cardRef = useRef<HTMLDivElement>(null);
//   const { addHoverAnimation } = useGSAPAnimation();

//   useEffect(() => {
//     if (!cardRef.current) return;

//     addHoverAnimation(cardRef.current, hoverScale, hoverDuration);
//   }, [addHoverAnimation, hoverScale, hoverDuration]);

//   return (
//     <div ref={cardRef} className={className}>
//       {children}
//     </div>
//   );
// };

// interface AnimatedCounterProps {
//   end: number;
//   duration?: number;
//   className?: string;
//   prefix?: string;
//   suffix?: string;
// }

// export const AnimatedCounter = ({
//   end,
//   duration = 2,
//   className = "",
//   prefix = "",
//   suffix = "",
// }: AnimatedCounterProps) => {
//   const counterRef = useRef<HTMLSpanElement>(null);
//   const { fadeIn } = useGSAPAnimation();

//   useEffect(() => {
//     if (!counterRef.current) return;

//     const obj = { value: 0 };

//     // Animate counter
//     const tl = gsap.timeline({
//       scrollTrigger: {
//         trigger: counterRef.current,
//         start: "top 80%",
//         once: true,
//       },
//     });

//     tl.to(obj, {
//       value: end,
//       duration,
//       ease: "power2.out",
//       onUpdate: () => {
//         if (counterRef.current) {
//           counterRef.current.textContent = `${prefix}${Math.round(obj.value)}${suffix}`;
//         }
//       },
//     });

//     // Fade in the counter
//     fadeIn(counterRef.current, 0.5, 0);

//     return () => {
//       tl.kill();
//     };
//   }, [end, duration, prefix, suffix, fadeIn]);

//   return (
//     <span ref={counterRef} className={className}>
//       0
//     </span>
//   );
// };

// interface ParallaxElementProps {
//   children: React.ReactNode;
//   speed?: number;
//   className?: string;
// }

// export const ParallaxElement = ({
//   children,
//   speed = 0.5,
//   className = "",
// }: ParallaxElementProps) => {
//   const elementRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!elementRef.current) return;

//     const tl = gsap.timeline({
//       scrollTrigger: {
//         trigger: elementRef.current,
//         start: "top bottom",
//         end: "bottom top",
//         scrub: 1,
//       },
//     });

//     tl.to(elementRef.current, {
//       y: -100 * speed,
//       ease: "none",
//     });

//     return () => {
//       tl.kill();
//     };
//   }, [speed]);

//   return (
//     <div ref={elementRef} className={className}>
//       {children}
//     </div>
//   );
// };
